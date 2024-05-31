import linkModel from '../Models/links.js'
import userModel from "../Models/users.js";

const LinksController = {

    getLinks: async (req, res) => {
        try {
            const links = await linkModel.find();
            res.send(links);
        } catch (error) {
            console.error("Error retrieving Links:", error);
            res.status(500).send("Internal Server Error");
        }
    },

  

    getById: async (req, res) => {
        const id  = req.params.id;
        console.log(`Fetching link with ID: ${id}`);
        
        try {
          const link = await linkModel.findById(id);
          if (!link) {
            return res.status(404).json({ message: 'Link not found' });
          }
    
          const targetParamName = link.targetParamName;
          const targetParamValue = req.query[targetParamName];
    
          const click = {
            insertedAt: new Date(),
            ipAddress: req.ip,
            targetParamValue: targetParamValue || ''
          };
    
          link.clicks.push(click);
          await link.save();
          console.log(`Redirecting to: ${link.originalUrl}`);
          if (!/^https?:\/\//.test(link.originalUrl)) {
              throw new Error('Invalid URL format');
          }
          res.redirect(link.originalUrl);
        } catch (err) {
          console.error(`Error fetching link with ID: ${id}`, err);
          res.status(500).json({ message: err.message });
        }
      },

    getLinkClicksBySource: async (req, res) => {
        const { id } = req.params;
    
        try {
            const link = await linkModel.findById(id);
            if (!link) {
                return res.status(404).json({ message: 'Link not found' });
            }
    
            const clicks = link.clicks;
            const clicksBySource = {};
    
            link.targetValues.forEach((source) => {
                clicksBySource[source.name] = clicks.filter((click) => click.targetParamValue === source.value).length;
            });
    
            res.status(200).json(clicksBySource);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    
    addLink: async (req, res) => {
        const { userId, originalUrl, clicks, targetParamName, targetValues } = req.body;
    
        try {
          const newLink = new linkModel({
            originalUrl,
            clicks: clicks || [],
            targetParamName: targetParamName || '',
            targetValues: targetValues || []
          });
    
          await newLink.save();
    
          const user = await userModel.findById(userId);
          if (!user) {
            return res.status(404).json({ message: 'Link not found' });
          }
    
          user.links.push(newLink._id);
          await user.save();
    
          res.status(201).json({
            message: 'Link created successfully',
            shortUrl: `http://localhost:8787/links/${newLink._id}?t=VALUE`
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }},

    updateLink: async (req, res) => {
        try {
            const linkId = req.params.id;
            const linkData = req.body;
            await linkModel.findByIdAndUpdate(linkId, linkData);
            res.status(200).send("Link data updated successfully!");
        } catch (error) {
            console.error("Error updating Link data:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    deleteLink: async (req, res) => {
        try {
            const linkId = req.params.id;
            await linkModel.findByIdAndDelete(linkId);
            res.status(200).send("Link deleted successfully!");
        } catch (error) {
            console.error("Error deleting Link:", error);
            res.status(500).send("Internal Server Error");
        }
    }
};

export default LinksController;
