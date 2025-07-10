async function loadBooks() {
  try {
    const res = await fetch('https://book-market-backend.onrender.com/api/books');
    const books = await res.json();
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = '';

    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.innerHTML = `
        <img src="${book.imageUrl}" alt="Book Image">
        <h3>${book.name}</h3>
        <p><strong>Location:</strong> ${book.location}</p>
        <p><strong>Contact:</strong> ${book.contact}</p>
      `;
      booksContainer.appendChild(bookCard);
    });
  } catch (err) {
    console.error('Error loading books:', err);
  }
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('book-name').value;
  const location = document.getElementById('book-location').value;
  const contact = document.getElementById('book-contact').value;
  const imageFile = document.getElementById('book-image').files[0];

  if (!imageFile) {
    alert('Please select an image');
    return;
  }

  // 1. Upload image to Cloudinary
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', 'bookupload'); // Replace below
  const cloudName = 'dlqykz04l'; // Replace below

  try {
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const cloudinaryData = await cloudinaryRes.json();

    const imageUrl = cloudinaryData.secure_url;

    // 2. Upload book to backend
    const res = await fetch('https://book-market-backend.onrender.com/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, imageUrl, location, contact })
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Book uploaded!');
      loadBooks();
    } else {
      alert('❌ Error uploading book: ' + data.message);
    }

  } catch (err) {
    console.error('❌ Upload failed:', err);
    alert('❌ Upload failed. Check console.');
  }
});

// Load books on page load
window.onload = loadBooks;
