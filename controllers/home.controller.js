exports.getHome= (req, res, next)=>{
        res.render('index', {
            isLogged : req.session.userId,
            validationError: req.flash('validationErrors')[0],
            isAdmin: req.session.isAdmin,
            page: "home"  ,
            friendRequests : req.friendRequests

        })
}
