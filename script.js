document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const contactList = document.getElementById('contactList');
    const sortBtn = document.getElementById('sortBtn');
    
    // Variables d'état
    let contacts = [];
    let sortAscending = true;
    
    // Charger les contacts depuis le localStorage
    function loadContacts() {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            contacts = JSON.parse(savedContacts);
            renderContacts();
        }
    }
    
    // Sauvegarder les contacts dans le localStorage
    function saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    
    // Valider le formulaire
    function validateForm() {
        let isValid = true;
        
        // Validation du nom
        if (nameInput.value.trim() === '') {
            document.getElementById('nameError').textContent = 'Le nom est obligatoire';
            isValid = false;
        } else {
            document.getElementById('nameError').textContent = '';
        }
        
        // Validation de l'email (optionnel mais doit être valide si rempli)
        if (emailInput.value.trim() !== '' && !isValidEmail(emailInput.value)) {
            document.getElementById('emailError').textContent = 'Email invalide';
            isValid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        // Validation du téléphone (optionnel mais doit être valide si rempli)
        if (phoneInput.value.trim() !== '' && !isValidPhone(phoneInput.value)) {
            document.getElementById('phoneError').textContent = 'Téléphone invalide';
            isValid = false;
        } else {
            document.getElementById('phoneError').textContent = '';
        }
        
        return isValid;
    }
    
    // Vérifier si un email est valide
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Vérifier si un numéro de téléphone est valide
    function isValidPhone(phone) {
        const re = /^[0-9\s\-\(\)\+]{8,}$/;
        return re.test(phone);
    }
    
    // Ajouter un nouveau contact
    function addContact(name, email, phone) {
        const newContact = {
            id: Date.now(), // Utilisation du timestamp comme ID unique
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim()
        };
        
        contacts.push(newContact);
        saveContacts();
        renderContacts();
    }
    
    // Supprimer un contact
    function deleteContact(id) {
        contacts = contacts.filter(contact => contact.id !== id);
        saveContacts();
        renderContacts();
    }
    
    // Trier les contacts par nom
    function sortContacts() {
        contacts.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            
            if (sortAscending) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
        
        sortAscending = !sortAscending;
        renderContacts();
    }
    
    // Afficher les contacts dans la liste
    function renderContacts() {
        contactList.innerHTML = '';
        
        if (contacts.length === 0) {
            contactList.innerHTML = '<p>Aucun contact à afficher.</p>';
            return;
        }
        
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.className = 'contact-item';
            
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';
            contactInfo.innerHTML = `
                <strong>${contact.name}</strong><br>
                ${contact.email ? `Email: ${contact.email}<br>` : ''}
                ${contact.phone ? `Téléphone: ${contact.phone}` : ''}
            `;
            
            const contactActions = document.createElement('div');
            contactActions.className = 'contact-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.addEventListener('click', () => deleteContact(contact.id));
            
            contactActions.appendChild(deleteBtn);
            li.appendChild(contactInfo);
            li.appendChild(contactActions);
            contactList.appendChild(li);
        });
    }
    
    // Événements
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            addContact(
                nameInput.value,
                emailInput.value,
                phoneInput.value
            );
            
            // Réinitialiser le formulaire
            contactForm.reset();
        }
    });
    
    sortBtn.addEventListener('click', sortContacts);
    
    // Initialisation
    loadContacts();
});