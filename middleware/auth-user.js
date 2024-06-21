
//user authentication middleware 
exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);
    console.log(credentials);
    if(credentials) {
      const user = await User.findOne({where: {username: credentials.name}});
      if(user) {
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication for username: ${user.username}`);
  
          //store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.username}`;
        }
      } else {
        message = `User not found for username: ${user.username}`;
      }
    } else {
      message = `Auth header not found`;
    }
    if(message) {
      console.warn(message);
      res.status(401).json({message: 'Access Denied'});
    } else {
      next();
    }
  
  }