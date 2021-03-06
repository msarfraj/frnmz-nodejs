exports.min_vanity_length = 4;
exports.num_of_urls_per_hour = 50;

exports.get_user_query = 'SELECT * FROM user_data WHERE userid =';
exports.add_query = 'INSERT INTO user_data SET userid = {userid}, email = {email}, password = {password}';
exports.update_passwd_query = 'UPDATE user_data SET password = {password} WHERE userid = {userid}';
exports.update_views_query = 'UPDATE urls SET num_of_clicks = {VIEWS} WHERE id = {ID}';
exports.insert_view = 'INSERT INTO stats SET ip = {IP}, url_id = {URL_ID}, referer = {REFERER}';
exports.check_ip_query = 'SELECT COUNT(id) as counted FROM urls WHERE datetime_added >= now() - INTERVAL 1 HOUR AND ip = {IP}';
//herokudb
/*exports.host = 'us-cdbr-iron-east-04.cleardb.net';//?reconnect=true';
exports.user = 'b4fafab11ca4dc';
exports.password = '182d894d';
exports.database = 'heroku_9d88e519e560328';
*/
//local

if(process.env.NODE_ENV==='development'){
exports.host = 'localhost';
exports.user = 'node_user';
exports.password = 'node123';
exports.database = 'node_test_db';
}else{
//Openshift
exports.host = '172.30.44.59';
exports.user = 'nodeuser';
exports.password = 'nodeuser';
exports.database = 'nodetestdb';
}

