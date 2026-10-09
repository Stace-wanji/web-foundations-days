// DOM Elements
const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const status = document.getElementById('status');
const usersList = document.getElementById('users-list');

// State
let allUsers = [];

// Event Listeners
loadBtn.addEventListener('click', loadUsers);
filterInput.addEventListener('input', handleFilter);

async function loadUsers() {
    // Set loading state
    loadBtn.disabled = true;
    filterInput.disabled = true;
    status.textContent = 'Loading users...';
    usersList.innerHTML = '';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store simplified user objects in our array
        allUsers = data.map(user => ({
            name: user.name,
            email: user.email,
            city: user.address.city,
            companyName: user.company.name
        }));

        status.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
        
    } catch (error) {
        status.textContent = `Error loading users: ${error.message}`;
    } finally {
        // Re-enable controls regardless of success or failure
        loadBtn.disabled = false;
        filterInput.disabled = false;
    }
}

function renderUsers(list) {
    usersList.innerHTML = '';
    
    if (list.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No users match your filter.";
        usersList.appendChild(li);
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');
        
        // Using createElement and textContent for each field as required
        const nameEl = document.createElement('strong');
        nameEl.textContent = user.name;
        li.appendChild(nameEl);
        
        li.appendChild(document.createTextNode(' | '));
        
        const emailEl = document.createElement('span');
        emailEl.textContent = user.email;
        li.appendChild(emailEl);
        
        li.appendChild(document.createTextNode(' | '));
        
        const cityEl = document.createElement('span');
        cityEl.textContent = user.city;
        li.appendChild(cityEl);
        
        li.appendChild(document.createTextNode(' | '));
        
        const companyEl = document.createElement('span');
        companyEl.textContent = user.companyName;
        li.appendChild(companyEl);

        usersList.appendChild(li);
    });
}

function handleFilter(event) {
    const query = event.target.value.toLowerCase().trim();
    
    // Filter the stored array without making a new network request
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query)
    );
    
    renderUsers(filteredUsers);
}