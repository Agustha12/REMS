// js/script.js

// Sample properties data
const properties = [
    {
        id: 1,
        title: "Apartment in Bangalore",
        location: "Bangalore, Karnataka",
        type: "Apartment",
        price: "₹50,000",
        beds: 2,
        baths: 2,
        area: "1,200",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    },
    {
        id: 2,
        title: "House in Mumbai",
        location: "Mumbai, Maharashtra",
        type: "House",
        price: "₹80,000",
        beds: 3,
        baths: 2,
        area: "2,000",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    },
    {
        id: 3,
        title: "Apartment in Delhi",
        location: "Delhi, NCR",
        type: "Apartment",
        price: "₹45,000",
        beds: 2,
        baths: 1,
        area: "1,000",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
    },
    {
        id: 4,
        title: "Villa in Hyderabad",
        location: "Hyderabad, Telangana",
        type: "Villa",
        price: "₹1,20,000",
        beds: 4,
        baths: 3,
        area: "3,500",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
    },
    {
        id: 5,
        title: "Studio Apartment in Chennai",
        location: "Chennai, Tamil Nadu",
        type: "Apartment",
        price: "₹35,000",
        beds: 1,
        baths: 1,
        area: "800",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    },
    {
        id: 6,
        title: "Penthouse in Kolkata",
        location: "Kolkata, West Bengal",
        type: "Penthouse",
        price: "₹1,50,000",
        beds: 3,
        baths: 2,
        area: "2,500",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    },
    {
        id: 7,
        title: "Duplex in Pune",
        location: "Pune, Maharashtra",
        type: "Duplex",
        price: "₹95,000",
        beds: 3,
        baths: 2,
        area: "2,200",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
        id: 8,
        title: "Farmhouse in Jaipur",
        location: "Jaipur, Rajasthan",
        type: "Farmhouse",
        price: "₹2,00,000",
        beds: 5,
        baths: 3,
        area: "5,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
        id: 9,
        title: "Luxury Apartment in Ahmedabad",
        location: "Ahmedabad, Gujarat",
        type: "Apartment",
        price: "₹65,000",
        beds: 2,
        baths: 2,
        area: "1,500",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    }
];

// Function to create property card HTML with error handling for images
function createPropertyCard(property) {
    return `
        <div class="property-card">
            <img src="${property.image}" alt="${property.type}" 
                 onerror="this.onerror=null; this.src='images/placeholder.jpg'; this.parentElement.innerHTML='<div class=\\'image-error\\'><i class=\\'fas fa-image\\'></i><p>Image not available</p></div>';">
            <div class="property-info">
                <h4>${property.title}</h4>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">${property.price}</p>
                <div class="property-details">
                    <span><i class="fas fa-bed"></i> ${property.beds} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.baths} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area} sqft</span>
                </div>
                <button onclick="viewDetails(${property.id})" class="view-details-btn">View Details</button>
            </div>
        </div>
    `;
}

// Function to search and filter properties
function searchProperties() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const budgetFilter = document.getElementById('budget-filter').value;

    const filteredProperties = properties.filter(property => {
        const matchesLocation = property.location.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || property.type === typeFilter;
        const matchesBudget = !budgetFilter || 
            parseFloat(property.price.replace(/[^0-9.]/g, '')) <= parseFloat(budgetFilter);

        return matchesLocation && matchesType && matchesBudget;
    });

    const propertyGrid = document.querySelector('.property-grid');
    if (propertyGrid) {
        if (filteredProperties.length === 0) {
            propertyGrid.innerHTML = '<p>No properties found matching your criteria.</p>';
        } else {
            propertyGrid.innerHTML = filteredProperties.map(property => createPropertyCard(property)).join('');
        }
    } else {
        console.warn('Property grid element not found on this page.');
    }
}

// Function to view property details
function viewDetails(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        alert(`
            Property Details:
            ${property.title}
            Location: ${property.location}
            Price: ${property.price}
            Type: ${property.type}
            Beds: ${property.beds}
            Baths: ${property.baths}
            Area: ${property.area} sqft
        `);
        // In a real app, redirect to a details page:
        // window.location.href = `property-details.html?id=${id}`;
    } else {
        alert('Property not found.');
    }
}

// Login form handling with validation
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password.');
        return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Password length validation (as per SRS security requirements)
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }

    // Simulate role-based redirection (SRS REQ-6)
    // In a real app, this would be determined by the backend after authentication
    const mockUserRole = email.includes('admin') ? 'Admin' : 'Buyer'; // Mock role check
    alert(`Login successful! Welcome, ${mockUserRole}!`);
    if (mockUserRole === 'Admin') {
        window.location.href = 'admin-dashboard.html'; // Placeholder for admin page
    } else {
        window.location.href = 'index.html';
    }
    return false;
}

// Function to handle support form submission
function handleSupportSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('support-email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Simulate form submission (in a real app, this would send data to the backend)
    console.log('Support form submitted:', { name, email, subject, message });
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
    return false;
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial render of all properties on the Home page
    const propertyGrid = document.querySelector('.property-grid');
    if (propertyGrid) {
        propertyGrid.innerHTML = properties.map(property => createPropertyCard(property)).join('');
    } else {
        console.warn('Property grid element not found on this page.');
    }

    // Add event listener for the search button
    const searchButton = document.querySelector('.search-box button');
    if (searchButton) {
        searchButton.addEventListener('click', searchProperties);
    }
});