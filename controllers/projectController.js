const Category = require("../models/Category");
const { ObjectId } = require('mongodb');
const Project = require("../models/Project");

const createProject = async (req, res) => {
    // check for unique project
    const projectExists = await Project.findOne({ name: req.body.name });
    if (projectExists) {
        return res.send({ status: "error", message: "Project already exists" });
    }

    const projectData = {
        name: req.body.name,
        owner: req.user._id,
    }

    try {
        const project = await Project.create(projectData);
        project.ownerFirstname = 'owner';
        return res.send({ status: "success", message: "Project successfully created", data: project })
    } catch (err) {
        console.log(err)
        return res.send({ status: "error", message: err.message })
    }
}

const projectView = async (req, res) => {
    const searchFilter = req.user.role == 'user' ? { user: req.user._id } : {}
    const categories = await Category.find(searchFilter).populate({
        path: 'user',
        select: {
            _id: 1, firstName: 1, lastName: 1,
        },
    }).select('-__v');
    const project = await Project.findOne({ _id: req.params.projectId })
    return res.render('project', { 'status': '', curPath: req.path, categories: categories, project: project })
}

const projectDelete = async (req, res) => {
    const { projectId } = req.body;
    try {
        await Project.deleteOne({ _id: new ObjectId(projectId) });
        return res.send({ status: "success", message: "Project deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
}

const projectList = async (req, res) => {
    try {
        let projects = [];
        let query = {
            $or: [
                { owner: req.user._id },
                { groups: { $in: [req.user._id] } }
            ]
        };

        if (req.user.role === 'admin') {
            query = {}; // Fetch all projects for admin
        }

        projects = await Project.find(query)
            .populate({
                path: 'owner',
                select: {
                    _id: 1, firstName: 1, lastName: 1,
                },
            })
            .populate('groups', 'name')
            .select('-__v');

        projects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            ownerFirstname: project.owner.firstName,
            groups: project.groups,
            master: project.owner._id.equals(req.user._id) ? 'owner' : 'group'
        }));

        return res.send({ status: "success", projects: projects });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: "error", message: err.message });
    }
};


module.exports = {
    createProject,
    projectDelete,
    projectList,
    projectView,
}
