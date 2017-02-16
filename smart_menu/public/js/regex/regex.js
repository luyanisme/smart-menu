/**
 * Created by luyan on 2/16/17.
 */
function regex(string) {
	var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
	if (patrn.test(string)) {
		return false;
	} else{
		return true;
	}
};
