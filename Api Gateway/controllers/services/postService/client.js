const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/post.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const PostPackage = grpcObject.PostPackage;

// Client connection
const client = new PostPackage.Post(
  "localhost:5000",
  grpc.credentials.createInsecure()
);

getPost = (res, userid, postid) => {
  client.getPost(
    {
      userid: userid,
      postid: postid,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

getTimelineByUserId = (res, userid, offset, limit) => {
  client.getTimelineByUserId(
    {
      userid: userid,
      offset: offset,
      limit: limit,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

uploadBlog = (res, userid, title, category = "", getImagePostUrl = false) => {
  client.uploadBlog(
    {
      userid,
      title,
      category,
      getImagePostUrl,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

uploadPhoto = (res, userid, category = "") => {
  client.uploadPhoto(
    {
      userid,
      category,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

updateBlog = (res, userid, postid, title, category) => {
  client.updateBlog(
    {
      userid,
      postid,
      title,
      category,
      getBlogPostUrl,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

deletePost = (res, userid, postid) => {
  client.deletePost(
    {
      userid: userid,
      postid: postid,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
        return;
      }
      res.send(response);
    }
  );
};

module.exports = {
  getPost,
  getTimelineByUserId,
  uploadBlog,
  uploadPhoto,
  updateBlog,
  deletePost,
};
