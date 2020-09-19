const router = require("express").Router();
const { getFollowings } = require("../../services/followService/client");

router.get("/:userid", (req, res) => {
  const userid = req.params.userid;
  const offset = parseInt(req.query.offset);
  if(isNaN(offset)) return res.send({ success: false });
  var end = offset + 15;

  if (userid && offset >= 0) {
  	redisClientFollowings.zrange(userid, offset, end, (err, list) => {

  		if(err || (list === null)){
  			
  			return getFollowings(res, userid);
  		}

  		if(list.length){
  			res.send({
  				success: true,
  				userIdList: list
  			});
  		} else {
  			return getFollowings(res, userid);
  		}
  	})
  	
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
