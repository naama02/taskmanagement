const dashboard = async (req, res) => {
    return res.render('dashboard', {
        status: '',
    })
}

module.exports = {
    dashboard
}
