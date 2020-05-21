$(function() {
    $("body").width($(window).width())
    $("body").height($(window).height())
});

mp.gui.chat.show(false);

var Account = new class {
    constructor() {
        this._setup();
    }
    _setup() {
        this.username = "";
        this.password = "";
        this.salt = "";
        this.isBlocked = false;
    }
    generateSalt() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    login() {
        if (this.isBlocked == false) {
            console.log("login");
            this.username = $("#join_username").val();
            this.password = $("#join_password").val();
            //    alert("Login1" + this.username + ":"+this.password);
            if (this.password.length < 3) {
                if ($("#join_password").hasClass("red") == false) {
                    $("#join_password").addClass("red");
                }
            } else {
                $("#join_password").removeClass("red");
            }
            if ($("#join_password").hasClass("red") == false) {
            //    alert("Login" + this.username + ":"+this.password);
                mp.trigger("cef:account:login", this.username, this.password);
            } else {
                this.alert({
                    title: "Password",
                    titleSize: "16px",
                    message: "Please check your password (Min. length 4)   ",
                    messageColor: 'rgba(0,0,0,.8)',
                    position: "bottomCenter",
                    close: false
                })
            }
        }
    }
    register() {
        this.username = $("#reg_username").val();
        this.password = $("#reg_password").val() ;
        this.password2 = $("#req_password2").val();
        this.mail = $("#reg_email").val();
        if ($("#reg_password").val().length < 3) {
            if ($("#reg_password").hasClass("red") == false) {
                $("#reg_password").addClass("red");
            }
        } else {
            $("#reg_password").removeClass("red");
        }
        if ($("#reg_password").hasClass("red") == false) {
            console.log("username", this.username);
            console.log("password", this.password);
            console.log("password", this.password2);
            alert(this.password+":"+this.password2)
            if (this.password != this.password2) {
                $("#reg_password2").addClass("red");
                $("#reg_password2").removeClass("green");
                this.alert({
                    title: "Passwort",
                    titleSize: "16px",
                    message: "Passwörter nicht gleich",
                    messageColor: 'rgba(0,0,0,.8)',
                    position: "bottomCenter",
                    color: 'rgba(212,212,212, 0.8)',
                    progressBarColor: 'rgba(136, 48, 255, 0.6)',
                    close: false
                })
            } else {
                $("#reg_password2").removeClass("red");
                $("#reg_password2").addClass("green");
                if (this.mail.indexOf("@") > -1) {
                    $("#reg_email").removeClass("red");
                    $("#reg_email").addClass("green");
                    mp.trigger("cef:account:register", this.username, this.password, this.mail);
                } else {
                    $("#reg_email").addClass("red");
                    $("#reg_email").removeClass("green");
                    this.alert({
                        title: "eMail",
                        titleSize: "16px",
                        message: "eMail Adresse bitte korrigieren",
                        messageColor: 'rgba(0,0,0,.8)',
                        position: "bottomCenter",
                        color: 'rgba(212,212,212, 0.8)',
                        progressBarColor: 'rgba(136, 48, 255, 0.6)',
                        close: false
                    })
                }
            }
        } else {
            this.alert({
                title: "Passwort",
                titleSize: "16px",
                message: "Passwort zu kurz (min 4 zeichen)",
                messageColor: 'rgba(0,0,0,.8)',
                position: "bottomCenter",
                color: 'rgba(212,212,212, 0.8)',
                progressBarColor: 'rgba(136, 48, 255, 0.6)',
                close: false
            })
        }
    }
    alert(text) {
        this.isBlocked = false;
        /* notify({
             title: "Save",
             titleSize: "16px",
             message: "Succesfully saved your Account Data",
             messageColor: 'rgba(0,0,0,.8)',
             position: "bottomRight",
             close: false
         })*/
        iziToast.show(text);
    }
    toggle(target, origin) {
        $("#" + origin).hide();
        $("#" + target).show();
        $("#" + target).css({
            "opacity": "1"
        });
    }
}

function cef_loadlogin(name) {
    $("#join_username").val(name)
    $("#loading").animate({
        opacity: 0
    }, 100, function() {
        $("#login").show();
        $("#login").addClass("show");
    });
}

function cef_hidelogin() {
    $("#login").removeClass("show");
    $("#login").animate({
        opacity: 0,
        height: "0px"
    }, 300, function() {
        $("#login").hide();
    });
	mp.gui.chat.show(true);
}

function cef_toggleregister() {
    if (!$("#login").hasClass("hide")) {
        $("#login").addClass("hide");
        $("#register").addClass("show");
    }
}

/*function alert_login(text) {
    Account.alert(text)
}*/
