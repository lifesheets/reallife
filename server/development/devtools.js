/******************************************************************************
****************** Made and ©opyright by Sorginator & Z8pn ********************
******************************************************************************/

/********** Hilfs-Funktion ************
***** Input: Name eines Spielers ******
***** Output: Gesuchter Spieler *******
**************************************/

function getPlayerFromName(name) {
	let rueckgabeSpieler
	mp.players.forEach(
		(player, id) => {
			if (player.name == name || player.name.toLowerCase() == name.toLowerCase()) {
				rueckgabeSpieler = player;
			}
		}
	);
	return rueckgabeSpieler;
}

/************** Befehl ****************
***** Erstellt ein Fahrzeug und *******
***** setzt den Spieler hinein ********
**************************************/

mp.events.addCommand("auto", (player, cmd, auto_name) => {
	if (auto_name != null) {
		let veh = mp.vehicles.new(mp.joaat(auto_name), player.position,
		{
			numberPlate: "ADMIN",
			color: [[0, 255, 0],[0, 255, 0]]
		});
		player.putIntoVehicle(veh, -1);
	} else {
		player.outputChatBox("Nutze den Befehl wiefolgt: /auto [Fahrzeugtyp]")
	}
});

/************** Befehl ****************
****** Abfrage der Koordinaten ********
****** an der Spielerposition *********
**************************************/

mp.events.addCommand("wo", (player) => {
	var pos = player.position;
	player.outputChatBox("Deine Position: " + (Math.round(pos.x*100)/100) + ", " + (Math.round(pos.y*100)/100) + ", " + (Math.round(pos.z*100)/100));
});

/************** Befehl ****************
****** Gibt dem eigenen Spieler *******
******* die Waffe seiner Wahl *********
**************************************/

mp.events.addCommand("waffe", (player, cmd, waffe, muni) => {
	if (waffe != null) {
		if (muni == null) {
			muni = 1000
		}
		var wHash = mp.joaat(waffe)
		if (wHash != null) {
			player.giveWeapon(wHash, muni);
		} else {
			player.outputChatBox("Die Waffe " + (waffe || "") + " existiert nicht!");
		}
	} else {
		player.outputChatBox("Nutze den Befehl wiefolgt: /waffe [Waffenname][Munition]");
	}
});

/************** Befehl ****************
****** Um sich selbst zu einem ********
****** anderen Spieler zu porten ******
**************************************/

mp.events.addCommand("port", (player, cmd, name) => {

	if (name != null) {
		let zielSpieler = getPlayerFromName(name);
		if (zielSpieler != null) {
			let pos = zielSpieler.position;
			player.position = new mp.Vector3(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
		} else {
			player.outputChatBox("Der Spieler " + (name || "") + " ist dezeit nicht Online!")
		}
	} else {
		player.outputChatBox("Nutze den Befehl wiefolgt: /port [Name des Ziel Spielers]!");
	}
});

/************** Befehl ****************
****** Um einen anderen Spieler *******
****** zu sich zu teleportieren *******
**************************************/

mp.events.addCommand("hole", (player, cmd, name) => {
	if (name != null) {
		let zielSpieler = getPlayerFromName(name);
		if (zielSpieler != null) {
			let pos = player.position;
			zielSpieler.position = new mp.Vector3(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5);
		} else {
			player.outputChatBox("Der Spieler " + (name || "") + " ist dezeit nicht Online!")
		}
	} else {
		player.outputChatBox("Nutze den Befehl wiefolgt: /hole [Name des Ziel Spielers]!");
	}
});

/************** Befehl ****************
*** Setzt einem Spieler einen Skin ****
**************************************/

mp.events.addCommand("skin", (player, cmd, name, skin_id) => {
	if (name != null && skin_id != null) {
		let zielSpieler = getPlayerFromName(name);
		if (zielSpieler != null) {
			let skinID = mp.joaat(skin_id);
			if (skinID != null) {
				zielSpieler.model = skinID;
				player.outputChatBox("Skin gesetzt!")
			} else {
				player.outputChatBox("Es existiert kein Skin der ID " + skin_id + "!");
			}
		} else {
			player.outputChatBox("Der Spieler " + name + " ist derzeit nicht Online!");
		}
	} else {
		player.outputChatBox("Nutze den Befehl wiefolgt: /skin [Spielername][Skin-ID]!");
	}
});


