data.json: Reference Only
data.min.json: Actual Data used in project
Minification: http://www.cleancss.com/json-minify/;

================================================================================

Item Arrays
 - Consist of 4 Values
 -- 1: GroupID
 -- 2: Title
 -- 3: Icon
 -- 4: CSS.ID

ItemArray["GroupID"] -----------------------------------------------------------
- GroupIDs are used for two purposes.  1 it ensures that only one item of the
  group appears in the loadout selection and secondly it ensures that similar
  items are not picked successively between random loadouts.

  Example 1:   Support has "Mortar - HE" and "Mortar - AIR" in gadgets. Only one
               can be equipped at a time. Sharing the ID "GASU02" ensures that
               only one is selected at a time.

  Example 2:   There are 3 variants of the Cei-Rigotti rifle for medics. To ensure
               that each loadout refresh doesn't just select a different flavor of
               the rifle, we group all 3 variants as "PRME00"

  IDs are generated with the following methodology:
     Two-Letter identifier for the item type
        PR = Primary Weapon
        SE = Secondary Weapon
        ME = Melee Weapon
        GR = Grenade
        GA = Gadget
     Two-Letter identifier for the class
        AL = All Classes (Share items)
        AS = Assault
        ME = Medic
        SU = Support
        SC = Scout
     Two-Digit incrimental identifier by group (eg: 00, 01, 02, 03)

     Example 1:     A Pistol (Secondary Weapon) available for all classes would be
                    ALSE00, ALSE01, ALSE02, etc

     Example 2:     A Pistol (Secondary Weapon) available only for Scouts would be
                    ALSC00, ALSC01, ALSC02, etc


ItemArray["Title"] -------------------------------------------------------------
- This is pretty straight forward. It's a human readable string that is the title
  of the weapon selected.  This is used directly in the HTML to display the name
  of the weapon that was chosen by the device.


ItemArray["Icon"] --------------------------------------------------------------
- The Icon is a CSS ID that is used to draw special icons in the selector box
  to describe how a weapon is obtained.

  Common Values Include:
    "base":     This weapon is available in the base-game.  This includes the
                default guns as well as the guns you buy with War Bonds.

    "unlock":   Unlock weapons are available through achievements but do not require
                any DLC purchases. For example the Level 10 Class weapons are an unlock.

    "tsnp":     This indicates that a weapon requires "They Shall Not Pass" DLC to be
                purchased. All DLC weapons imply an unlock and thus do not need an unlock
                icon, just the DLC Icon

    "puzzle":   This indicates that an item is crafted through the puzzle system.
                The script supports this for all weapons, but at the time of this
                documentation, the only available BF1 puzzles appear to be melee items.


ItemArray["CSS.ID"] ------------------------------------------------------------
- This indicates what CSS Class should be use when drawing the item's sprite on screen.
  These should match up exactly with the style sheet definitions.