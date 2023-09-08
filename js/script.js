// 1/ Récupérer en javascript les données sur les séries présentes dans le fichier datas/series.json.

localStorage.setItem("favorite", "");


async function fetchingSeriesDatas() {
    const response = await fetch("/datas/series.json");
    const seriesData = await response.json();

    getIdSortedByDate(seriesData)

    displaySeriesStyles(getSeriesStyle(seriesData));
    seriesData.forEach(function (serie) {
        displaySerie(serie);
    });

    displaySerieByStyle(seriesData);
    getIdOnClick(seriesData);
    removeFavoriteOnClic();

    filterByClic(seriesData);


};

fetchingSeriesDatas();

// 2/ Créer une fonction pour afficher toutes les séries dans la page avec pour chacune son titre et son image.

function displaySerie(object) {
    let newContainer = document.createElement('div');
    let newH2 = document.createElement('h2');
    let newImg = document.createElement('img');
    newContainer.id = 'container';
    newContainer.classList.add('serie-container');
    newH2.classList.add('serie-title');
    newContainer.append(newH2);
    newContainer.append(newImg);
    document.getElementById("main-container").append(newContainer);
    newImg.src = object.image;
    newImg.id = object.id;
    newImg.classList.add('serie-img');
    newH2.textContent = object.name;
};


// 3/ Créer une fonction qui retourne la liste des styles de séries présents dans les données.

function getSeriesStyle(arrayObject) {
    let styleArray = [];
    arrayObject.forEach((object) => {
        object.styles.forEach((value) => {
            styleArray.push(value);
        });
    })

    styleArray.sort();

    let styleObject = styleArray.reduce(function (acc, curr) {
        if (acc[curr] == undefined) {
            acc[curr] = 0;
        }
        acc[curr] += 1;
        return acc;
    }, {});

    return styleObject;
}

// 4/ Créer une fonction qui affiche la liste des styles de séries.

function displaySeriesStyles(object) {

    Object.keys(object).forEach((value) => {
        const newLi = document.createElement('li');
        const newBtn = document.createElement('button');

        newBtn.classList.add('nav-btn');
        newBtn.id = (value);
        newBtn.textContent = `${value}(${object[value]})`;
        newLi.appendChild(newBtn);

        document.querySelector('#navbar-list').appendChild(newLi);
    });
    document.querySelector('#navbar-list li').firstElementChild.classList.add('active-btn');
}


// 5/ Créer une fonction qui compte le nombre de séries d'un style.

// 

// 6/ Affichez dans la liste des styles le nombre de séries corresondantes entre parenthèse.
//      Modifier la fonction de la question 4/


// 7/ Créer une fonction qui retourne les ID des séries d'un style.

function getSeriesIdFromStyle(object, style) {
    let idList = [];
    object.forEach((value, index) => {
        if (value.styles.includes(style)) {
            idList.push({ id: value.id })
        }
    })
    return idList;
}


// 8/ Créer une fonction qui souligne le dernier style cliqué.
// Un seul style doit rester souligné à la fois.

function displaySerieByStyle(object) {
    document.querySelector('#navbar-list').addEventListener('click', function (event) {

        if (!event.target.classList.contains('nav-btn')) return;
        removeAllUnderlineFromBtn();
        event.target.classList.add('active-btn');

        let seriesByStyle = getSeriesIdFromStyle(object, event.target.id);

        document.querySelectorAll("#container").forEach(function (container) {
            container.remove();
        });

        seriesByStyle.forEach(function (value) {
            object.forEach(function (serie) {
                displaySerieFromId(serie, value.id);
            });
        });

    });
};

// 9/ Créer une fonction pour retirer le soulignement de tous les styles.

function removeAllUnderlineFromBtn() {
    document.querySelector('#navbar-list li .active-btn').classList.remove('active-btn');
};

// 10/ Créer une fonction qui affiche dans la page uniquement les séries dont l'id est en paramètre.

function displaySerieFromId(object, identifiant) {
    if (parseInt(identifiant) !== object.id) return;
    displaySerie(object);
};

// 11/ Modifier la fonction de la question 8/ pour n'afficher que les series du style souligné.



// 12/ Créer une fonction qui retourne toutes les données d'une série à partir de sont ID.

function consoleSerieInfo(object, identifiant) {
    object.forEach(function (serie) {
        console.log('              ');
        for (const info in serie) {
            if (serie.id == identifiant) {
                console.info(`${info} : ${serie[info]}`);
            }
        }
    });
}


// 13/ Créer une fonction qui permet qu'au clic sur une série, on affiche son id dans la console.
// 14/ Modifier la fonction ci-dessus pour retourner toutes les infos de la serie cliquée dans la console.
// 16/ Créer une fonction pour ajouter une série en favori au clic.


function getIdOnClick(object) {
    document.querySelector("#main-container").addEventListener('click', function (event) {
        if (!event.target.classList.contains('serie-img')) return;
        consoleSerieInfo(object, event.target.id);
        displayFavorite(addToFavourite(object, event.target.id));

    });

}

// 15/ Créer une fonction permettant d'ajouter une série à une liste de favoris dans un array.
// Une série ne peut être présente qu'une fois dans le tableau.

function addToFavourite(object, identifiant) {
    let serieName;
    object.forEach(function (serie) {
        if (serie.id == identifiant) serieName = serie.name;
    });
    return serieName;
};


// 17/ Créer une fonction qui affiche le nom des séries favorites dans la page.
// 20/ Créer une fonction qui affiche le nombre de favoris en titre de la liste des favoris.

function displayFavorite(name) {
    let fullName = name;
    name = name.split(' ');
    name = name.join('');
    if (document.querySelector(`#${name}`) !== null) return;
    const newDiv = document.createElement('div');
    const newP = document.createElement('p');
    newP.classList.add('favorite-name');
    newP.id = name;
    newDiv.appendChild(newP);
    newP.textContent += fullName + ' ';
    document.querySelector('#favorite').appendChild(newDiv);
    document.querySelector('#favorite-counter').textContent++;
}


// 18/ Créer une fonction permettant de retirer une série de la liste des favoris de par son id.
// 19/ Créer une fonction qui fasse qu'au clic sur un favori il se retire de la liste des favoris.

function removeFavoriteOnClic() {
    document.querySelector('#favorite').addEventListener('click', function (event) {
        if (!event.target.classList.contains('favorite-name')) return;
        event.target.remove();
        document.querySelector('#favorite-counter').textContent--;
    });
};

// 21/ Créer une fonction qui retourne les id des séries par ordre d'année de sortie.

function getIdSortedByDate(object) {
    let idDate = [];
    object.forEach(function (serie) {
        idDate.push({ id: serie.id, date: serie.launchYear })
    });

    idDate.sort((a, b) => {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    });

    idDate.forEach((serie, index) => idDate[index] = serie.id);

    return idDate;

}
// 22/ Créer une fonction qui affiche les séries dans la page dans l'ordre des ids passés en paramètre.

function sortSerieByDate(object, array) {
    for (const id of array) {
        object.forEach(function (serie) {
            displaySerieFromId(serie, id);
        });
    };
};

// 23/ Créer une fonction qui permet de gérer au click sur un lien dans la page le tri des series par années croissantes.

function filterByClic(object) {
    document.querySelector('#serie-filter').addEventListener('click', function (event) {
        if (!event.target.classList.contains('filter-btn')) return;

        document.querySelectorAll("#container").forEach(function (container) {
            container.remove();
        });
        sortSerieByDate(object, getIdSortedByDate(object));
    });
}


// 24/ Permettez à la fonction précédente de gérer un click sur un autre lien pour trier les series par années décroissantes.