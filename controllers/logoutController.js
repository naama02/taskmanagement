const logout = async (req, res) => {
    res.render('login', {
        status: 'logout'
    })
}

module.exports = {
    logout
}
