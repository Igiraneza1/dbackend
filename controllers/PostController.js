import Post from "../modals/PostModal.js"; 

export const createPost = async (req, res) => {
  try {
    const { date, content } = req.body;

    if (!date || !content) {
      return res.status(400).json({ message: "All fields (date, content) are required!" });
    }

    const newPost = new Post({
      date,
      content, 
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};
