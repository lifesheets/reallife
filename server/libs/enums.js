let enum_count = 0;
var enums = {
    PASSWORD_WRONG:enum_count++,
    EMAIL_ALREADY_IN_USE:enum_count++,
    EMAIL_USERNAME_IN_USE:enum_count++
}
Object.keys(enums).forEach(function(key, value) {
	global[key] = enums[key];
})
module.exports = enums;