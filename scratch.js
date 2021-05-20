// Emplacement de l'API météo sur le net
const baseApiUrl = 'http://localhost:8080/api/tickets';
const baseApiLearner = 'http://localhost:8080/api/learners';
const learnersList = [];
const ticketList = [];

let lineCounter = 1;
let lastHelpRequestName = "";


//gestion de la liste de valeurs
fetch(baseApiLearner)
    .then(response => response.json())
    .then(learners => {

        //construction de la liste de valeurs

        //for (let i = 0; i < learners.length; i++)
        for (const learner of learners) {
            let option = document.createElement("OPTION");
            option.value = learner.id;
            option.textContent = learner.firstName;
            document.getElementById("learner").appendChild(option);

            learnersList.push(learner);
        }

    })

//Affichage du contenu du tableau dès chargement de la page HTML
fetch(baseApiUrl)
    .then(response => response.json())
    .then(response => {

            let table = document.getElementById("table-body");

            //Construction du corps du tableau
            for (let i = 0; i < response.length; i++) {
                let tablerow = document.createElement("tr");
                let col1 = document.createElement("td");
                //let col2 = document.createElement("td");
                let col3 = document.createElement("td");
                let col4 = document.createElement("td");
                let col5 = document.createElement("td");

                col1.innerText = response[i]["id"];
                //col2.innerText = response[i]["learnerIdx"];
                //col3
                fetch("http://localhost:8080/api/learners/" + response[i]["learnerIdx"]).then(response => response.json()).then(learner => col3.innerText = learner.firstName)

                col4.innerText = response[i]["description"];
                col5 = document.createElement("button");
                col5.textContent = "Je passe mon tour";

                // const td4 = document.createElement("td");
                // const button = document.createElement("button");
                // button.textContent = "Je passe mon tour";

                tablerow.appendChild(col1);
                //tablerow.appendChild(col2);
                tablerow.appendChild(col3);
                tablerow.appendChild(col4);
                tablerow.appendChild(col5);

                table.appendChild(tablerow);
            }
        }
    )
    .catch(error => alert("Erreur : " + error));


document.getElementById("help-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const description = document.getElementById("input-name2").value;
    const learneridx = document.getElementById("learner").value;


    requestDetails = {
        // On choisit la méthode
        method: "POST",
        // On définit le corps de la requête
        body: JSON.stringify({
            date: new Date(),
            description: description,
            learnerIdx: learneridx,
            solved: false
        }),
        // On dit qu'on envoit du JSON
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    fetch('http://localhost:8080/api/tickets', requestDetails)//.then()
        .catch(error => alert("Erreur : " + error));

    // Je récupère le nom de la personne qui veut de l'aide
    const name = document.getElementById("learner");
    var strUser = name.options[name.selectedIndex].text;

    if (name !== lastHelpRequestName) {
        // Je m'occupe de créer une nouvelle ligne dans le tableau
        const ligne = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.textContent = lineCounter;
        ligne.appendChild(td1);

        const td2 = document.createElement("td");
        td2.textContent = strUser;
        ligne.appendChild(td2);

        const td3 = document.createElement("td");
        td3.textContent = description;
        ligne.appendChild(td3);

        const td4 = document.createElement("td");
        const button = document.createElement("button");

        button.textContent = "Je passe mon tour";


        button.addEventListener("click", function () {

            if (button.parentElement.parentElement.className === "line-through") {
                button.parentElement.parentElement.className = "";
                button.textContent = "Je passe mon tour";
            } else {
                button.parentElement.parentElement.className = "line-through";
                button.textContent = "Je veux mon tour";

                requestDetails = {
                    // On choisit la méthode
                    method: "PUT",
                    // On définit le corps de la requête
                    body: JSON.stringify({
                        // date: new Date(),
                        // description: description,
                        // learnerIdx: learneridx,
                        solved: true
                    }),
                    // On dit qu'on envoit du JSON
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }
                fetch('http://localhost:8080/api/tickets/' + lineCounter, requestDetails)//.then()
                    .catch(error => alert("Erreur : " + error));

            }
        });

        td4.appendChild(button);
        ligne.appendChild(td4);

        const table = document.getElementById("table-body");
        table.appendChild(ligne);

        // J'incrémente mon compteur de personnes qui ont besoin d'aide
        lineCounter++;

        // Je met à jour le lastHelpRequestName
        lastHelpRequestName = name;

        // A la fin, on vide le champ input pour pouvoir mettre un nouveau nom.
        document.getElementById("learner").value = "";
    } else {
        alert("Tu es déjà dans la liste mon coco.");
    }
});

document.getElementById("button-next").addEventListener("click", function () {
    const nameTable = document.getElementById("table-body");

    if (nameTable.firstElementChild !== null) {
        nameTable.removeChild(nameTable.firstElementChild);
    }

    // const id = document.getElementById("td").value;

    requestDetails = {
        // On choisit la méthode
        method: "PUT",
        // On définit le corps de la requête
        body: JSON.stringify({
            // date: new Date(),
            // description: description,
            // learnerIdx: learneridx,
            solved: true
        }),
        // On dit qu'on envoit du JSON
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }
    fetch('http://localhost:8080/api/tickets/' + id, requestDetails)//.then()
        .catch(error => alert("Erreur : " + error));

});
