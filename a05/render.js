/**
 * Course: COMP 426
 * Assignment: a05
 * Author: Andrew Li
 *
 * This script uses jQuery to build an HTML page with content taken from the
 * data defined in data.js.
 */



/**
 * Given a hero object (see data.js), this function generates a "card" showing
 *     the hero's name, information, and colors.
 * @param hero  A hero object (see data.js)
 */
export const renderHeroCard = function(hero) {
    let newNode = document.createElement('div');
    newNode.setAttribute('id', hero.name);
    
    let topSide = document.createElement('div');
    topSide.style.backgroundColor = hero.backgroundColor;
    
    let img = document.createElement('img');
    img.setAttribute('src', hero.img);
    
    let heroName = document.createElement('span');

    let botSide = document.createElement('div');
    botSide.style.backgroundColor = hero.color;
    
    let subtitle = document.createElement('h4')
    subtitle.classList.add('subtitle');

    let alterEgo = document.createElement('div');
    let firstApp = document.createElement('div');
    let descrip = document.createElement('p');
    let edit = document.createElement('button');
    edit.classList.add('edit');
    


    newNode.append(topSide, botSide);
    topSide.append(img, heroName);
    heroName.append(hero.name);
    botSide.append(alterEgo, firstApp, descrip, edit);
    alterEgo.append("Alter ego: " + hero.first + " " + hero.last);
    firstApp.append("First appearance: " + hero.firstSeen);
    descrip.append(hero.description);
    edit.append("Edit");
    edit.addEventListener("click", handleEditButtonPress);

    return newNode;
};



/**
 * Given a hero object, this function generates a <form> which allows the
 *     user to edit the fields of the hero. The form inputs should be
 *     pre-populated with the initial values of the hero.
 * @param hero  The hero object to edit (see data.js)
 */
export const renderHeroEditForm = function(hero) {
    let strings = ['Hero Name:', 'First Name:', 'Last Name:', 'First Seen:', 'Description'];
    let labelStrings = ['heroName', 'fName', 'lName', 'date', 'descrip'];
    
    let form = document.createElement('form');
    let heroName = document.createElement('input');
    let fName = document.createElement('input');
    let lName = document.createElement('input');
    let date = document.createElement('input');
    let descrip = document.createElement('textarea');
    
    let ele = [heroName, fName, lName, date, descrip];

    let heroNameL = document.createElement('label');
    let fNameL = document.createElement('label');
    let lNameL = document.createElement('label');
    let dateL = document.createElement('label');
    let descripL = document.createElement('label');
   
    let labels = [heroNameL, fNameL, lNameL, dateL, descripL];
    let defaultVals = [hero.name, hero.first, hero.last, hero.firstSeen, hero.description]
    
    let save = document.createElement('button');
    save.append('save');
    save.setAttribute('type', 'submit');
    save.classList.add('submit');

    let cancel = document.createElement('button');
    cancel.append('cancel');
    cancel.setAttribute('type', 'cancel');
    cancel.classList.add('cancel');



    for (let i = 0; i < 5; i++) {
        form.append(labels[i], ele[i]);
        labels[i].setAttribute('for', labelStrings[i]);
        labels[i].append(strings[i]);
        ele[i].setAttribute('id', labelStrings[i]);
        ele[i].defaultValue = defaultVals[i];
    }

    form.append(heroNameL, heroName, fNameL, fName, lNameL, lName, dateL, date, descripL, descrip, save, cancel);
    form.addEventListener("submit", handleEditFormSubmit);
    cancel.addEventListener("click", handleCancelButtonPress);
    form.setAttribute('id', hero.name);
    return form;
};



/**
 * Handles the JavaScript event representing a user clicking on the "edit"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditButtonPress = function(event) {
    let div = this.parentNode.parentNode;
    let heroName = div.getAttribute('id');

    let i = 0;
    while (heroicData[i].name != heroName) {
        i++;
    }

    let editform = renderHeroEditForm(heroicData[i]);
    let parentDiv =div.parentNode;

    parentDiv.replaceChild(editform, div);

};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleCancelButtonPress = function(event) {
    event.preventDefault();

    let form = this.parentNode;
    let heroName = form.getAttribute('id');

    let root = form.parentNode;

    let i = 0;
    while (heroicData[i].name != heroName) {
        i++;
    }
    let heroCard = renderHeroCard(heroicData[i]);

    root.replaceChild(heroCard, form);

    // TODO: Render the hero card for the clicked hero and replace the
    //       hero's edit form in the DOM with their card instead
};



/**
 * Handles the JavaScript event representing a user clicking on the "cancel"
 *     button for a particular hero.
 * @param event  The JavaScript event that is being handled
 */
export const handleEditFormSubmit = function(event) {
    event.preventDefault();

    let id = this.getAttribute('id');
   

    let root = this.parentNode;
    let list = this.children;

    let heroName = list[1].value;
    let fName = list[3].value;
    let lName = list[5].value;
    let date = list[7].value;
    let obj = new Date(date);
    let descrip = list[9].value;

    let i = 0;

    while (heroicData[i].name != id) {
        i++;
    }

    heroicData[i].name = heroName;
    heroicData[i].first = fName;
    heroicData[i].last = lName;
    heroicData[i].firstSeen =  obj;
    heroicData[i].description = descrip;

    let heroCard = renderHeroCard(heroicData[i]);

    root.replaceChild(heroCard, this);

    // TODO: Render the hero card using the updated field values from the
    //       submitted form and replace the hero's edit form in the DOM with
    //       their updated card instead
};



/**
 * Given an array of hero objects, this function converts the data into HTML,
 *     loads it into the DOM, and adds event handlers.
 * @param  heroes  An array of hero objects to load (see data.js)
 */
export const loadHeroesIntoDOM = function(heroes) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');

    // TODO: Generate the heroes using renderHeroCard()
    let heroesHTML = [];
    for (let i = 0; i < heroes.length; i++) {
        heroesHTML[i] = renderHeroCard(heroes[i]);
    }
    // TODO: Append the hero cards to the $root element
    for (let i = 0; i < heroesHTML.length; i++) {
        $root.append(heroesHTML[i]);
    }
    let buffer = document.createElement('div');
    // TODO: Use jQuery to add handleEditButtonPress() as an event handler for
    //       clicking the edit button
    // TODO: Use jQuery to add handleEditFormSubmit() as an event handler for
    //       submitting the form
    // TODO: Use jQuery to add handleCancelButtonPress() as an event handler for
    //       clicking the cancel button
};



/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadHeroesIntoDOM(heroicData);
});
