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

// Upload new book
document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('book-name').value;
  const imageUrl = document.getElementById('book-image').value;
  const location = document.getElementById('book-location').value;
  const contact = document.getElementById('book-contact').value;

  try {
    const res = await fetch('https://book-market-backend.onrender.com/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, imageUrl, location, contact })
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Book uploaded!');
      loadBooks(); // Reload book list
    } else {
      alert('❌ Error uploading book: ' + data.message);
    }
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
});

// Load books on page load
window.onload = loadBooks;
