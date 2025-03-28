// js/script.js

// Backend API URL
const API_URL = 'http://127.0.0.1:8000';

// Function to display properties in the grid
function displayProperties(properties) {
    const propertyGrid = document.querySelector('.property-grid');
    if (!propertyGrid) {
        console.warn('Property grid element not found');
        return;
    }

    if (!Array.isArray(properties)) {
        console.error('displayProperties received non-array:', properties);
        propertyGrid.innerHTML = '<p>Error: Invalid property data</p>';
        return;
    }

    if (properties.length === 0) {
        propertyGrid.innerHTML = '<p>No properties found!</p>';
        return;
    }

    try {
        propertyGrid.innerHTML = properties.map(property => createPropertyCard(property)).join('');
        console.log(`Displayed ${properties.length} properties`);
    } catch (error) {
        console.error('Error displaying properties:', error);
        propertyGrid.innerHTML = '<p>Error displaying properties</p>';
    }
}

// Function to fetch properties from the backend
async function fetchProperties(location = '', type = '', budget = '') {
    try {
        const queryParams = new URLSearchParams();
        if (location) queryParams.append('location', location);
        if (type) queryParams.append('type', type);
        if (budget) queryParams.append('max_budget', budget);

        console.log('Fetching properties with:', queryParams.toString());

        const response = await fetch(`${API_URL}/properties/search?${queryParams.toString()}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.error('Response not OK:', response.status, response.statusText);
            throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        // Validate the response data
        if (!data) {
            console.error('Received null or undefined data');
            throw new Error('No data received from server');
        }

        if (!Array.isArray(data)) {
            console.error('Expected array of properties, got:', typeof data);
            throw new Error('Unexpected API response format');
        }

        // Validate each property object
        const validProperties = data.filter(property => {
            if (!property || typeof property !== 'object') {
                console.warn('Invalid property object:', property);
                return false;
            }
            return true;
        });

        console.log(`Found ${validProperties.length} valid properties`);
        
        if (validProperties.length === 0) {
            console.log('No valid properties found');
            displayProperties([]);
            return [];
        }

        displayProperties(validProperties);
        return validProperties;
    } catch (error) {
        console.error('Error fetching properties:', error);
        displayProperties([]);
        return [];
    }
}

// Function to create property card HTML
function createPropertyCard(property) {
    console.log('Creating card for property:', property);
    console.log('Image URL:', property.ImageURL);
    
    // Validate property data
    if (!property || !property.Type || !property.location || !property.Cost) {
        console.error('Invalid property data:', property);
        return '';
    }

    // Generate a placeholder image based on property type
    const getPlaceholderImage = (type) => {
        const baseUrl = 'https://via.placeholder.com/800x600';
        const text = encodeURIComponent(`${type || 'Property'} Image`);
        const color = 'f0f0f0';
        return `${baseUrl}/${color}/666666?text=${text}`;
    };

    // Get image URL or use placeholder
    const imageUrl = property.ImageURL === null || property.ImageURL === undefined ? 
        getPlaceholderImage(property.Type) : 
        `${API_URL}/images/${property.ImageURL}`;
    console.log('Final image URL:', imageUrl);

    // Create card HTML
    return `
        <div class="property-card">
            <div class="property-image-container">
                <img src="${imageUrl}" 
                     alt="${property.Type || 'Property'}" 
                     class="property-image"
                     onerror="console.error('Failed to load image:', this.src); this.onerror=null; this.src='https://via.placeholder.com/800x600/f0f0f0/666666?text=Image+Not+Found';">
                ${property.Status ? `<span class="property-status ${property.Status.toLowerCase()}">${property.Status}</span>` : ''}
            </div>
            <div class="property-info">
                <h4>${property.Type || 'Property'} in ${property.location?.TownCity || 'Unknown Location'}</h4>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location?.TownCity || 'Unknown'}, ${property.location?.State || 'Unknown'}</p>
                <p class="price">₹${(property.Cost || 0).toLocaleString()}</p>
                <div class="property-details">
                    <span><i class="fas fa-ruler-combined"></i> ${property.Size || 0} sqft</span>
                    ${property.Rating ? `<span><i class="fas fa-star"></i> ${property.Rating}</span>` : ''}
                    ${property.Features ? `<span><i class="fas fa-info-circle"></i> ${property.Features}</span>` : ''}
                </div>
                <button onclick="viewDetails(${property.PropertyID})" class="view-details-btn">View Details</button>
            </div>
        </div>
    `;
}

// Function to search and filter properties
async function searchProperties() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const budgetFilter = document.getElementById('budget-filter').value;

    await fetchProperties(searchTerm, typeFilter, budgetFilter);
}

// Function to view property details
async function viewDetails(id) {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property details');
        const property = await response.json();
        
        alert(`
            Property Details:
            ${property.Type} in ${property.location?.TownCity || 'Unknown Location'}
            Location: ${property.location?.TownCity || 'Unknown'}, ${property.location?.State || 'Unknown'}
            Price: ₹${(property.Cost || 0).toLocaleString()}
            Type: ${property.Type}
            Size: ${property.Size || 0} sqft
            Features: ${property.Features || 'N/A'}
            Rating: ${property.Rating || 'N/A'}
            Status: ${property.Status || 'N/A'}
        `);
    } catch (error) {
        console.error('Error fetching property details:', error);
        alert('Failed to load property details. Please try again later.');
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

// Function to test API connection and CORS
async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const response = await fetch(`${API_URL}/test-cors`);
        console.log('Test response status:', response.status);
        
        if (!response.ok) {
            console.error('API test failed:', response.status, response.statusText);
            return false;
        }
        
        const data = await response.json();
        console.log('API test response:', data);
        return true;
    } catch (error) {
        console.error('API test error:', error);
        return false;
    }
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Test API connection first
    const isConnected = await testAPIConnection();
    if (!isConnected) {
        console.error('Failed to connect to API. Please check if the backend server is running.');
        return;
    }

    // Initial render of all properties on the Home page
    const propertyGrid = document.querySelector('.property-grid');
    if (propertyGrid) {
        console.log('Found property grid, fetching properties...');
        const properties = await fetchProperties();
        console.log(`Rendering ${properties.length} properties`);
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
