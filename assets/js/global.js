$(document).ready(function() {
    //**************************************************************************
    //** GLOBALS ***************************************************************
    //**************************************************************************
    var bDebug = false;                                                         //Show Debug messages?
    var sJSON = 'assets/json/data.min.json?v=20171211';                         //Path to JSON Data
    var aClasses = ['assault','support','medic','scout'];                       //Static Classes
    var aData = "";                                                             //Stores JSON Data upon load
    var aPrevious = { class:  "nil", primary:"nil", secondary:"nil",            //Store IDs for Previously Used Items
                      gadget1:"nil", gadget2:"nil", melee:"nil"};               //to ensure each pick is unique
    var aToolTips = { "unlock": "Unlocks through class achievements",
                      "puzzle": "Unlocks through Battlepack Puzzles",
                      "tsnp":   "Unlocks through 'They Shall Not Pass' DLC",
                      "tsar":   "Unlocks through 'In The Name of the Tsar' DLC"}

    //**************************************************************************
    //** PSUEDO-PUBLIC FUNCTIONS ***********************************************
    //**************************************************************************
    //[c]hangeClass
    /*  Changes the UI Display of a selected class and then rebuilds that
     classes loaded
     @params     string      required        The Selected Class to change to
     @returns    nothing                     Updates the Class Labels, Redraws Loadouts */
    function changeClass(Class) {
        debug("changeClass(" + Class + ")");
        aPrevious['class'] = Class;
        $("#popupclass").removeClass("show");                                   //Hide Popup if it exists
        $("#classicon").removeClass().addClass("icon class " + Class);          //Update Class Icon
        $("#classname").text(Class);                                            //Update Class Label
        changeLoadout(Class);                                                   //Update All Items
    }

    //[c]hangeGadget
    /*  Picks a random gadget and then updates the appropriate UI Elements
     @params     string      required        The Selected Class that we are adjusting gadgets for
     @params     integer     required        The Gadget index (1 or 2)
     @params     string      required        The HTML ID of the Gadget's Icon Element
     @params     string      required        The HTML ID of the Gadget's Label Element
     @returns    nothing                     Picks a random gadget, redraws the UI */
    function changeGadget(Class,Index,IDIcon,IDLabel,IDMeta) {
        debug("changeGadget("+Class+", "+Index+", "+IDIcon+", "+IDLabel+")");
        var sPrevious = "";
        if(Index == 1) {
            sPrevious = aPrevious['gadget2'];
        } else {
            sPrevious = aPrevious['gadget1'];
        }
        debug("> Previous: " + sPrevious);
        var aTemp = getRandomGadget(Class,Index,sPrevious);
        $(IDIcon).removeClass().addClass("icon weapon gadget " + aTemp[3]);
        $(IDMeta).removeClass().addClass("icon meta " + aTemp[2]);
        $(IDMeta).attr('title', aToolTips[aTemp[2]]);
        $(IDLabel).text(aTemp[1]);
    }

    //[c]hangeItem
    /*  Randomly picks an Item and updates the UI As needed
     @params     string      required        The Selected Class that we are adjusting items for (eg: assault, support)
     @params     string      required        What are you changing? primary, secondary, grenade, melee ?
     @params     string      required        The HTML ID of the Item's Icon Element
     @params     string      required        The HTML ID of the Item's Label Element
     @returns    nothing                     Picks a random Class Type Item, redraws the UI  */
    function changeItem(Class,Type,IDIcon,IDLabel,IDMeta) {
        var aTemp = getRandomItem(Class,Type);
        $(IDIcon).removeClass().addClass("icon weapon " + Type + " " + aTemp[3]);
        $(IDMeta).removeClass().addClass("icon meta " + aTemp[2]);
        $(IDMeta).attr('title', aToolTips[aTemp[2]]);
        $(IDLabel).text(aTemp[1]);
    }

    //[c]hangeLoadout
    /*  Randomly pick out a new weapon kit/loadout for a selected class
     @params     string      required        The Selected Class that we are adjusting items for
     @returns    nothing                     Picks random weapons, grenades, gadgets, etc and redraws the UI */
    function changeLoadout(Class) {
        changeItem(Class,   "primary",        "#pricon",  "#prname",  "#prmeta");
        changeItem(Class,   "secondary",      "#scicon",  "#scname",  "#scmeta");
        changeItem(Class,   "grenade",        "#gricon",  "#grname",  "#grmeta");
        changeGadget(aPrevious['class'],  1,  "#g1icon",  "#g1name",  "#g1meta");
        changeGadget(aPrevious['class'],  2,  "#g2icon",  "#g2name",  "#g2meta");
    }

    //[l]oadJSONData
    /*  Load the Kit JSON Data and store it as an array for later use
     @params     boolean     optional        If true, also load a new random class (First page load use)
     @returns    nothing                     Sets global aData with JSON Data */
    function loadJSONData(FirstLoad) {
        debug("loadJSONData()");
        $.getJSON(sJSON, function (data) {
            aData = data;
            if(FirstLoad) {
                changeClass(getRandomClass());
            }
        });
    }

    //[t]ogglePopup
    /*  Toggle's the "show" class of a selected Element
     @params     string      required        The HTML ID of the Element to manipulate
     @returns    nothing                     Toggles "show" on/off for the ElementID */
    function togglePopup(ElementID) {
        debug("togglePopup(" + ElementID+")");
        $(ElementID).toggleClass("show");
    }

    //**************************************************************************
    //** PSUEDO-PRIVATE FUNCTIONS **********************************************
    //**************************************************************************
    //[d]ebug
    /*  Echo's Debug information to the Console with atimestamps if bDebug is enabeld
     @params     string      required        The Message to echo out to the console
     @returns    nothing                     Prepends Timestamp to the message and draws into the Developer console
     @note                                   Set bDebug in Globals to false to disable all output in production  */
    function debug(Message) {
        if(bDebug == false) { return null;}
        console.log($.now() + " " + Message);
    }

    //[g]etRandomClass
    /*  Picks a Random Class that is different from the existing class
     @params     none
     @returns    string                      A newly selected class (e.g.: "support")  */
    function getRandomClass() {
        debug("getRandomClass()");
        var sSelected = aPrevious['class'];
        while(sSelected == aPrevious['class']) {
            var iRandom = Math.floor(Math.random() * aClasses.length);
            sSelected = aClasses[iRandom];
        }
        debug("> " + aClasses[iRandom]);
        aPrevious['class'] = aClasses[iRandom];
        return aClasses[iRandom];
    }

    //[g]etRandomGadget
    /*  Picks a random gadet that is unique from it's sibling gadget but remains
     restricted properly by class
     @params     string      required        The Selected Class to pick a gadget for
     @params     integer     required        Of the 2 gadget slots, which one are you picking? [1||2]
     @params     string      required        What is the currently equipped sibling gadget ID?
     This is used to ensure you dont' pick two tripwires for esxample
     @returns    array                       array[GadgetID, GadgetLabel]
     Example:  array["GA001", "Tripwire - INC"] */
    function getRandomGadget(Class,Index,OtherGadget) {
        debug("getRandomGadget(" + Class + ", " + Index+", "+OtherGadget+")");
        var aTemp = aData['classes']['all']['gadget'].concat(aData['classes'][Class]['gadget']);
        var aReturn = [];
        var sSelected = aPrevious['gadget' + Index];
        while (aPrevious['gadget' + Index] == sSelected || sSelected == OtherGadget) {
            var iRandom = Math.floor(Math.random() * aTemp.length);
            sSelected = aTemp[iRandom][0];
        }
        debug("> [" + aTemp[iRandom][0] + "] " + aTemp[iRandom][1]);
        aPrevious['gadget' + Index] = sSelected;
        return aTemp[iRandom];
    }

    //[g]etRandomItem
    /*  Pick a random Item (Weapon/Melee/Grenade) for a Class that isn't currently equipped
     @params     string      required        The Class to pick an item for (e.g.: support)
     @params     string      required        The Type of weapon to pick (e.g.: primary, secondary, melee)
     @returns    array                       array[ItemID, ItemLabel]
     Example: array["PRSU001", "Lewis-Gun Optical"] */
    function getRandomItem(Class,Type) {
        debug("getRandomItem("+Class+", " + Type + ")");
        var aTemp = aData['classes']['all'][Type].concat(aData['classes'][Class][Type]);
        var sSelected=aPrevious[Type];
        while (aPrevious[Type] == sSelected) {
            var iRandom = Math.floor(Math.random() * aTemp.length);
            sSelected = aTemp[iRandom][0];
        }
        debug("> [" + aTemp[iRandom][0] + "] " + aTemp[iRandom][1]);
        aPrevious['class'] = Class;
        aPrevious[Type] = sSelected;
        return aTemp[iRandom];
    }

    //[t]ouchEnable
    /*  Captures a the Touch Start/End events and triggers a CSS class to make
     the box "flash" to show that it has been activated. Desktops utilize :active
     @params     none
     @returns    nothing                 Toggles the "touched" CSS class to the box */
    function touchEnable() {
        debug("touchEnable()");
        $('.box').bind('touchstart touchend', function(e) {
            $(this).toggleClass('touched');
            debug("> Toggle");
        });
    }

    //**************************************************************************
    //** ROUTINES / BINDS ******************************************************
    //**************************************************************************
    /* First Load (Pass True, Triggers class selection) */
    touchEnable();
    loadJSONData(true);

    /* Click Event || Class Popup */
    $("#class").click(function() { togglePopup("#popupclass"); });

    /* Click Event || Pop-Up Class Selections */
    $("#popupclass-as").click(function() {  changeClass('assault'); });
    $("#popupclass-me").click(function() {  changeClass('medic'); });
    $("#popupclass-sc").click(function() {  changeClass('scout'); });
    $("#popupclass-su").click(function() {  changeClass('support'); });
    $("#popupclass-rnd").click(function() { changeClass(getRandomClass()); });

    /* Click Event || Class/Loadout Buttons */
    $("#rndClass").click(function() {   changeClass(getRandomClass()); });
    $("#rndKit").click(function() {     changeLoadout(aPrevious['class']); });

    /* Click Event || Individual Items */
    $("#primary").click(function() {    changeItem(aPrevious['class'],   "primary",    "#pricon",  "#prname",  "#prmeta"); });
    $("#secondary").click(function() {  changeItem(aPrevious['class'],   "secondary",  "#scicon",  "#scname",  "#scmeta"); });
    $("#grenade").click(function() {    changeItem(aPrevious['class'],   "grenade",    "#gricon",  "#grname",  "#grmeta"); });
    $("#gadget1").click(function() {    changeGadget(aPrevious['class'], 1,            "#g1icon",  "#g1name",  "#g1meta"); });
    $("#gadget2").click(function() {    changeGadget(aPrevious['class'], 2,            "#g2icon",  "#g2name",  "#g2meta"); });
});