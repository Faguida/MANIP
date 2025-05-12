document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contactForm");
    const contactList = document.getElementById("contactList");
    const sortButton = document.getElementById("sortButton");

    function loadContacts() {
        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        displayContacts(contacts);
    }

    function saveContacts(contacts) {
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    function displayContacts(contacts) {
        contactList.innerHTML = "";
        contacts.forEach(contact => addContact(contact.name, contact.email, contact.phone));
    }

    function addContact(name, email, phone) {
        if (!name || !email || !phone) return;

        // Vérifier si email ou téléphone existent déjà
        const existingContacts = getContacts();
        const duplicate = existingContacts.some(contact => contact.email === email || contact.phone === phone);

        if (duplicate) {
            alert("Un contact avec cet email ou numéro existe déjà !");
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `<span>${name} - ${email} - ${phone}</span> 
                        <button class="delete">❌</button>`;

        li.querySelector(".delete").addEventListener("click", () => {
            if (confirm("Voulez-vous vraiment supprimer ce contact ?")) {
                li.remove();
                saveContacts(getContacts());
            }
        });

        contactList.appendChild(li);
    }

    function getContacts() {
        return Array.from(contactList.children).map(li => {
            const [name, email, phone] = li.querySelector("span").textContent.split(" - ");
            return { name, email, phone };
        });
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        addContact(name, email, phone);
        saveContacts(getContacts());
        contactForm.reset();
    });

    sortButton.addEventListener("click", () => {
        const sortedContacts = getContacts().sort((a, b) => a.name.localeCompare(b.name));
        displayContacts(sortedContacts);
        saveContacts(sortedContacts);
    });

    loadContacts();
});
