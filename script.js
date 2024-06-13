$(document).ready(function () {
    class Book {
        constructor(id, title, author, year, publisher, pages, copies) {
            this.id = id || Date.now();
            this.title = title;
            this.author = author;
            this.year = year;
            this.publisher = publisher;
            this.pages = pages;
            this.copies = copies;
        }
    }

    class Visitor {
        constructor(id, name, phone) {
            this.id = id || Date.now();
            this.name = name;
            this.phone = phone;
        }
    }

    class Card {
        constructor(id, visitorId, bookId, issueDate, returnDate = null) {
            this.id = id || Date.now();
            this.visitorId = visitorId;
            this.bookId = bookId;
            this.issueDate = issueDate;
            this.returnDate = returnDate;
        }
    }

    const books = JSON.parse(localStorage.getItem('books')) || [];
    const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    const cards = JSON.parse(localStorage.getItem('cards')) || [];

    function loadSection(sectionId) {
        $('.section').hide();
        $(sectionId).show();
    }

    function loadBooks(searchQuery = '', sortBy = 'title') {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        $('#booksTable tbody').empty();
        let filteredBooks = books.filter(book => {
            return book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                book.year.toString().includes(searchQuery) ||
                book.publisher.toLowerCase().includes(searchQuery) ||
                book.pages.toString().includes(searchQuery) ||
                book.copies.toString().includes(searchQuery);
        });

        filteredBooks.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

        filteredBooks.forEach(book => {
            $('#booksTable tbody').append(`
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${book.publisher}</td>
                    <td>${book.pages}</td>
                    <td>${book.copies}</td>
                    <td>
                        <img src="image/edit-icon.png" class="edit-icon" data-id="${book.id}">
                        <img src="image/delete-icon.png" class="delete-icon" data-id="${book.id}">
                    </td>
                </tr>
            `);
        });
    }
    function loadVisitors(searchQuery = '', sortBy = 'name') {
        const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        $('#visitorsTable tbody').empty();
        let filteredVisitors = visitors.filter(visitor => {
            return visitor.id.toString().includes(searchQuery) ||
                visitor.name.toLowerCase().includes(searchQuery) ||
                visitor.phone.toString().includes(searchQuery);
        });

        filteredVisitors.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

        filteredVisitors.forEach(visitor => {
            $('#visitorsTable tbody').append(`
                <tr>
                    <td>${visitor.id}</td>
                    <td>${visitor.name}</td>
                    <td>${visitor.phone}</td>
                    <td>
                        <img src="image/edit-icon.png" class="edit-icon" data-id="${visitor.id}">
                        <img src="image/delete-icon.png" class="delete-icon" data-id="${visitor.id}">
                    </td>
                </tr>
            `);
        });
    }
    function loadCards(searchQuery = '', sortBy = 'id') {
        const cards = JSON.parse(localStorage.getItem('cards')) || [];
        $('#cardsTable tbody').empty();
        let filteredCards = cards.filter(card => {
            return card.id.toString().includes(searchQuery) ||
                card.visitorId.toString().includes(searchQuery) ||
                card.bookId.toString().includes(searchQuery) ||
                card.issueDate.toString().includes(searchQuery) ||
                (card.returnDate && card.returnDate.toString().includes(searchQuery));
        });

        filteredCards.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

        filteredCards.forEach(card => {
            const user = JSON.parse(localStorage.getItem('visitors')).find(visitor => visitor.id === card.visitorId);
            const book = JSON.parse(localStorage.getItem('books')).find(book => book.id === card.bookId);
            $('#cardsTable tbody').append(`
            <tr>
                <td>${card.id}</td>
                <td>${card.visitorId}</td>
                <td>${card.bookId}</td>
                <td>${card.issueDate}</td>
                <td>${card.returnDate ? card.returnDate : '<span class="info-text">Не повернуто</span>'}</td>
                <td>${card.returnDate ? '' : '<img src="image/return.png" class="return_icon return-btn" data-id="' + card.id + '">'}</td>
            </tr>
            <tr>
                <td colspan="6">\tВiдвiдувач(ПIБ): ${user ? user.name : 'Unknown'}, Назва книги: ${book ? book.title : 'Unknown'}</td>
            </tr>
        `);
        });
    }
    function loadModalOptions() {
        const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        const books = JSON.parse(localStorage.getItem('books')) || [];
        $('#cardVisitor').empty();
        $('#cardBook').empty();
        visitors.forEach(visitor => {
            $('#cardVisitor').append(`<option value="${visitor.id}">${visitor.name}</option>`);
        });
        books.forEach(book => {
            if (book.copies > 0) {
                $('#cardBook').append(`<option value="${book.id}">${book.title}</option>`);
            }
        });
    }

    function loadUserInfoModal(userId) {
        const user = visitors.find(visitor => visitor.id === userId);
        $('#userName').text(user.name);
        $('#userPhone').text(user.phone);
        $('#userId').text(user.id);

        const takenBooks = cards.filter(card => card.visitorId === userId && !card.returnDate);
        const returnedBooks = cards.filter(card => card.visitorId === userId && card.returnDate);

        $('#takenBooksTable tbody').empty();
        takenBooks.forEach(card => {
            const book = books.find(b => b.id === card.bookId);
            $('#takenBooksTable tbody').append(`
            <tr>
                <td>${book.id}</td> 
                <td>${book.title}</td>
                <td>${card.issueDate}</td>
                <td>${card.returnDate ? card.returnDate : '<span class="info-text">Не повернуто</span>'}</td>
            </tr>
        `);
        });

        $('#returnedBooksTable tbody').empty();
        returnedBooks.forEach(card => {
            const book = books.find(b => b.id === card.bookId);
            $('#returnedBooksTable tbody').append(`
            <tr>
                <td>${book.id}</td> 
                <td>${book.title}</td>
                <td>${card.issueDate}</td>
                <td>${card.returnDate}</td>
            </tr>
        `);
        });

        $('#userInfoModal').modal('show');
    }

    function loadBookInfoModal(bookId) {
        const book = books.find(b => b.id === bookId);
        $('#bookTitle_info').text(book.title);
        $('#bookAuthor_info').text(book.author);
        $('#bookYear_info').text(book.year);
        $('#bookPublisher_info').text(book.publisher);
        $('#bookPages_info').text(book.pages);
        $('#bookId_info').text(book.id);

        const bookUsers = cards.filter(card => card.bookId === bookId);

        $('#bookUsersTable tbody').empty();
        bookUsers.forEach(card => {
            const user = visitors.find(visitor => visitor.id === card.visitorId);
            if (user) {
                $('#bookUsersTable tbody').append(`
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${card.issueDate}</td>
                    <td>${card.returnDate ? card.returnDate : 'Не повернуто'}</td>
                </tr>
            `);
            }
        });

        $('#bookInfoModal').modal('show');
    }

    $('#navTabs .nav-link').click(function (e) {
        e.preventDefault();
        $('#navTabs .nav-link').removeClass('active');
        $(this).addClass('active');
        loadSection($(this).data('target'));
    });

    $('#bookForm').submit(function (e) {
        e.preventDefault();
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = new Book(
            $('#bookId').val(),
            $('#bookTitle').val(),
            $('#bookAuthor').val(),
            $('#bookYear').val(),
            $('#bookPublisher').val(),
            $('#bookPages').val(),
            parseInt($('#bookCopies').val())
        );

        if ($('#bookId').val()) {
            const index = books.findIndex(b => b.id === book.id);
            books[index] = book;
        } else {
            books.push(book);
        }
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
        $('#bookModal').modal('hide');
    });

    $('#visitorForm').submit(function (e) {
        e.preventDefault();
        const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        const visitor = new Visitor(
            $('#visitorId').val(),
            $('#visitorName').val(),
            $('#visitorPhone').val()
        );

        if ($('#visitorId').val()) {
            const index = visitors.findIndex(v => v.id === visitor.id);
            visitors[index] = visitor;
        } else {
            visitors.push(visitor);
        }
        localStorage.setItem('visitors', JSON.stringify(visitors));
        loadVisitors();
        $('#visitorModal').modal('hide');
    });

    $('#cardForm').submit(function (e) {
        e.preventDefault();
        const cards = JSON.parse(localStorage.getItem('cards')) || [];
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const card = new Card(
            $('#cardId').val(),
            parseInt($('#cardVisitor').val()),
            parseInt($('#cardBook').val()),
            $('#cardIssueDate').val()
        );

        console.log($('#cardBook').val());

        if ($('#cardId').val()) {
            const index = cards.findIndex(c => c.id === card.id);
            cards[index] = card;
        } else {
            cards.push(card);
            const book = books.find(b => b.id === card.bookId);
            if (book) {
                book.copies--;
                localStorage.setItem('books', JSON.stringify(books));
            } else {
                console.error('Book not found with ID:', card.bookId);
            }
        }
        localStorage.setItem('cards', JSON.stringify(cards));
        loadCards();
        loadBooks();
        $('#cardModal').modal('hide');
    });

    $('#booksTable').on('click', '.edit-icon', function (e) {
        e.stopPropagation();
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const book = books.find(b => b.id === $(this).data('id'));
        $('#bookId').val(book.id);
        $('#bookTitle').val(book.title);
        $('#bookAuthor').val(book.author);
        $('#bookYear').val(book.year);
        $('#bookPublisher').val(book.publisher);
        $('#bookPages').val(book.pages);
        $('#bookCopies').val(book.copies);
        $('#bookModalLabel').text('Редагувати книгу');
        $('#bookModal').modal('show');
    });

    $('#booksTable').on('click', '.delete-icon', function (e) {
        e.stopPropagation();
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(b => b.id !== $(this).data('id'));
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    });

    $('#visitorsTable').on('click', '.edit-icon', function (e) {
        e.stopPropagation();
        const visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        const visitor = visitors.find(v => v.id === $(this).data('id'));
        $('#visitorId').val(visitor.id);
        $('#visitorName').val(visitor.name);
        $('#visitorPhone').val(visitor.phone);
        $('#visitorModalLabel').text('Редагувати відвідувача');
        $('#visitorModal').modal('show');
    });

    $('#visitorsTable').on('click', '.delete-icon', function (e) {
        e.stopPropagation();
        let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        visitors = visitors.filter(v => v.id !== $(this).data('id'));
        localStorage.setItem('visitors', JSON.stringify(visitors));
        loadVisitors();
    });

    $('#cardsTable').on('click', '.return-btn', function (e) {
        e.stopPropagation();
        console.log(e)
        const cards = JSON.parse(localStorage.getItem('cards')) || [];
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const card = cards.find(c => c.id === $(this).data('id'));
        card.returnDate = new Date().toLocaleDateString();
        const book = books.find(b => b.id === card.bookId);
        book.copies++;
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('cards', JSON.stringify(cards));
        loadCards();
        loadBooks();
    });

    $('#statisticsButton').on('click', function(){
        const popularBooks = books.slice().sort((a, b) => b.copies - a.copies).slice(0, 5);
        const activeVisitors = visitors.slice().sort((a, b) => {
            const aCount = cards.filter(c => c.visitorId === a.id).length;
            const bCount = cards.filter(c => c.visitorId === b.id).length;
            return bCount - aCount;
        }).slice(0, 5);

        $('#popularBooksList').empty();
        popularBooks.forEach(book => {
            $('#popularBooksList').append(`<tr><td>${book.title}</td><td>${book.copies}</td></tr>`);
        });

        $('#activeVisitorsList').empty();
        activeVisitors.forEach(visitor => {
            const visitCount = cards.filter(c => c.visitorId === visitor.id).length;
            $('#activeVisitorsList').append(`<tr><td>${visitor.name}</td><td>${visitCount}</td></tr>`);
        });
    });

    $('#searchBooks').on('input', function() {
        loadBooks($(this).val().toLowerCase(), $('#sortBooks').val());
    });

    $('#sortBooks').on('change', function() {
        loadBooks($('#searchBooks').val().toLowerCase(), $(this).val());
    });

    $('#searchVisitors').on('input', function() {
        loadVisitors($(this).val().toLowerCase(), $('#sortVisitors').val());
    });

    $('#sortVisitors').on('change', function() {
        loadVisitors($('#searchVisitors').val().toLowerCase(), $(this).val());
    });

    $('#searchCards').on('input', function() {
        loadCards($(this).val().toLowerCase(), $('#sortBooks').val());
    });

    $('#sortCards').on('change', function() {
        loadCards($('#searchBooks').val().toLowerCase(), $(this).val());
    });

    $('#cardModal').on('show.bs.modal', loadModalOptions);

    $('#visitorsTable tbody').on('click', 'tr', function (e) {
        if (!$(e.target).hasClass('edit-icon') && !$(e.target).hasClass('delete-icon')) {
            const userId = $(this).find('td:first').text();
            loadUserInfoModal(parseInt(userId));
        }
    });

    $('#bookUsersTable tbody').on('click', 'tr', function (e) {
        const userId = $(this).find('td:first').text();
        loadUserInfoModal(parseInt(userId));
    });

    $('#booksTable tbody').on('click', 'tr', function (e) {
        if (!$(e.target).hasClass('edit-icon') && !$(e.target).hasClass('delete-icon')) {
            const bookId = $(this).find('td:first').text();
            loadBookInfoModal(parseInt(bookId));
        }
    });

    $('#takenBooksTable tbody').on('click', 'tr', function (e) {
        const bookId = $(this).find('td:first').text();
        loadBookInfoModal(parseInt(bookId));

    });
    $('#returnedBooksTable tbody').on('click', 'tr', function (e) {
        const bookId = $(this).find('td:first').text();
        loadBookInfoModal(parseInt(bookId));

    });

    $('#cardsTable tbody').on('click', 'tr', function (e) {
        if (!$(e.target).hasClass('return-btn')) {
            const cellIndex = $(e.target).index();
            const row = $(this);

            if (cellIndex === 1) {
                const visitorId = row.find('td').eq(1).text();
                loadUserInfoModal(parseInt(visitorId));
            } else if (cellIndex === 2) {
                const bookId = row.find('td').eq(2).text();
                loadBookInfoModal(parseInt(bookId));
            }
        }
    });



    loadBooks();
    loadVisitors();
    loadCards();
    loadSection('#booksSection');
});
