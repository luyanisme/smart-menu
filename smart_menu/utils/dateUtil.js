/**
 * Created by luyan on 08/05/2017.
 */
exports.getDate =function () {
	var date = new Date();
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
}