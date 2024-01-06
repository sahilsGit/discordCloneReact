import { Profile, Server } from "../modals/Schema.js";

export const getAll = async (req, res, next) => {
  try {
    // TODO : Possiblity for reducing db look for optimisation

    const profileId = req.user.profileId;
    const profile = await Profile.findById(profileId); // Use the id from JWT token

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find all servers with ids in profile's servers array
    const servers = await Server.find({
      _id: { $in: profile.servers },
    });

    // Map servers to only return necessary fields

    const serverData = servers.map((server, index) => ({
      name: server.name,
      id: server._id,
      image: server.image,
      channels: index === 0 ? server.channels : undefined, // Additional data for 1st server
      members: index === 0 ? server.members : undefined,
    }));

    if (res.body) {
      res.body = {
        ...res.body,
        servers: serverData,
        profileId: profileId,
      };
    } else {
      res.body = { servers: serverData, profileId: profileId };
    }

    res.status(200).send(res.body);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOne = async (req, res, next) => {
  try {
    // const profile = await Profile.findById(req.user.profileId); // Use the id from JWT token

    // if (!profile) {
    //   return res.status(404).json({ message: "Profile not found" });
    // }

    // // Find all servers with ids in profile's servers array
    // const server = await Server.findOne({
    //   _id: req.params.server,
    // });

    const profileId = req.user.profileId;

    const server = await Server.findOne({
      _id: req.params.server,
      profileId,
    });

    if (!server) {
      res.status(404).json({ message: "Server not found" });
    }

    const serverData = {
      name: server.name,
      id: server._id,
      image: server.image,
      channels: server.channels,
      members: server.members,
    };

    if (res.body) {
      res.body = { ...res.body, server: serverData, profileId: profileId };
    } else {
      res.body = { server: serverData, profileId: profileId };
    }

    res.status(200).send(res.body);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};