async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'bookupload'); // replace with your actual preset

  const res = await fetch('https://api.cloudinary.com/v1_1/dlqykz04l/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url; // URL to use as image
}

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
        <img src="${book.image}" alt="Book Image">
        <h3>${book.name}</h3>
        <p><strong>Location:</strong> ${book.location}</p>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Subject:</strong> ${book.subject}</p>
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
  const author = document.getElementById('book-author').value;
  const subject = document.getElementById('book-subject').value;
  const location = document.getElementById('book-location').value;
  const imageFile = document.getElementById('book-image').files[0];

  if (!imageFile) {
    alert('❌ Please select an image to upload!');
    return;
  }

  try {
    const imageUrl = await uploadImageToCloudinary(imageFile);

    const res = await fetch('https://book-market-backend.onrender.com/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, author, subject, location, image: imageUrl }),
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
    alert('❌ Upload failed. Check console for details.');
  }
});

window.onload = loadBooks;
