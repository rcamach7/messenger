const User = require("../models/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// ! Endpoint(s) for "/user/"
exports.user_get = [
  // Pull the token received and add it to the request.
  (req, res, next) => {
    // Pull the bearerHeader
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(403).json({
        message: "Protected route - not authorized",
      });
    }
  },
  (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET_STRING, (err, authData) => {
      if (err) {
        res.status(403).json({ msg: "Failed authentication" });
      } else {
        // Only gets hit if user is authorized
        res.json({ authData });
      }
    });
  },
];

// Retrieves user by providing body fields and sends token back.
exports.login_user_post = [
  // Data Validation and sanitation.
  check("username").exists().bail().trim().isLength({ min: 4 }),
  check("password").exists().bail().trim().isLength({ min: 4 }),
  // Before attempting to authorize, check for validation errors.
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    }
    next();
  },
  passport.authenticate("local", {
    session: false,
  }),
  // Return JWT token upon validation
  (req, res, next) => {
    jwt.sign(
      {
        username: req.user.username,
        _id: req.user._id,
        fullName: req.user.fullName,
        profilePicture: req.user.profilePicture,
      },
      process.env.SECRET_STRING,
      {
        expiresIn: "48h",
      },
      (err, token) => {
        if (err) next(err);

        res.json({ token, user: req.user });
      }
    );
  },
];

// Creates a user by providing body fields.
// * implement sanitation and validation for fullName field
exports.create_user_post = [
  // Data Validation and sanitation.
  check("username")
    .exists()
    .bail()
    .trim()
    .isLength({ min: 4 })
    .custom((value) => {
      // Makes sure the username is not already in use by another member
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username Already Exists");
        }
      });
    }),
  check("password").exists().bail().trim().isLength({ min: 4 }),
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    }

    // Hash password for user security
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) next(err);

      // Create new user with defaulted values
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.fullName,
        profilePicture: "",
        friends: [],
      });

      newUser.save((err) => {
        if (err) next(err);

        // Create our JWT token with user information
        jwt.sign(
          {
            username: newUser.username,
            fullName: newUser.fullName,
            profilePicture: newUser.profilePicture,
            _id: newUser._id,
          },
          process.env.SECRET_STRING,
          {
            expiresIn: "48h",
          },
          (err, token) => {
            if (err) next(err);

            res.json({
              token,
              user: {
                username: newUser.username,
                fullName: newUser.fullName,
                profilePicture: newUser.profilePicture,
                _id: newUser._id,
              },
              msg: "Account created",
            });
          }
        );
      });
    });
  },
];

// Updates user by providing body fields.
// At this point we only support updating name field.
// In the end we need to sign a new token, and have user replace the old one with the one we sent, since the old token is signed with old name.
// Possibly break it down to another middleware for easier maintainability
exports.update_user_put = [
  // Pull the token received and add it to the request.
  (req, res, next) => {
    // Pull the bearerHeader
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(403).json({
        message: "Protected route - not authorized",
      });
    }
  },
  (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET_STRING, (err, authData) => {
      if (err) {
        res.status(403).json({ msg: "Failed authentication" });
      } else {
        if (req.body.fullName.length >= 4) {
          User.findByIdAndUpdate(authData._id, {
            $set: { fullName: req.body.fullName },
          }).exec((err, updatedUser) => {
            if (err) next(err);

            // Create new token for our user and send it back
            jwt.sign(
              {
                username: updatedUser.username,
                fullName: updatedUser.fullName,
                profilePicture: updatedUser.profilePicture,
                _id: updatedUser._id,
              },
              process.env.SECRET_STRING,
              {
                expiresIn: "48h",
              },
              (err, token) => {
                if (err) next(err);

                res.json({
                  token,
                  user: {
                    username: updatedUser.username,
                    fullName: updatedUser.fullName,
                    profilePicture: updatedUser.profilePicture,
                    _id: updatedUser._id,
                  },
                  msg: "Account updated",
                });
              }
            );
          });
        } else {
          res.status(400).json({ msg: "Name too short" });
        }
        // res.json({ authData, msg: "Name updated" });
      }
    });
  },
];

// Deletes user by providing body fields
exports.user_delete = (req, res, next) => {
  res.json("OK");
};
