import React, { useState } from "react";

// Firebase config
import { app } from "../firbase/config";

// Firebase
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddProjectForm = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState("website");
  const [loader, setLoader] = useState(false);
  const [link, setLink] = useState("https://");
  const [level, setLevel] = useState("medium");
  const [tags, setTags] = useState("HTML, CSS");
  const [imageFile, setImageFile] = useState(null);
  const [urlType, setUrlType] = useState("website");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [githubLink, setGithubLink] = useState("https://github.com/");

  // Add project data
  const addProject = async (projectData, imageFile) => {
    setLoader(true);

    try {
      if (imageFile) {
        const storageRef = ref(storage, `projects/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        const newProject = {
          ...projectData,
          image: imageUrl,
        };

        const docRef = await addDoc(collection(db, "projects"), newProject);
        alert(`Project added successfully! ID: ${docRef.id}`);

        // reload page
        window.location.reload();
      } else {
        alert("No photo selected!");
      }
    } catch (error) {
      alert("Something went wrong :(");
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      type,
      level,
      githubLink,
      title: { uz: title, en: titleEn },
      link: { value: link, type: urlType },
      tags: tags.split(",").map((tag) => tag.trim()),
      description: { uz: description, en: descriptionEn },
    };

    addProject(projectData, imageFile);
  };

  const handleUpdateUrlType = (e) => {
    const value = e.target.value.trim().toLowerCase();

    if (value === "figma") {
      setLink("https://figma.com/");
    } else if (value === "telegram") {
      setLink("https://t.me/");
    } else if (value === "telegram-bot") {
      setLink("https://t.me/ bot");
    } else {
      setLink("https://");
    }

    setUrlType(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${loader ? "animate-pulse" : ""} flex flex-col gap-5`}
    >
      {/* Title */}
      <label className="flex flex-col gap-3.5">
        <span>Title (Uzbek)</span>
        <input
          required
          type="text"
          value={title}
          placeholder="Title (Uzbek)"
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      {/* Title En */}
      <label className="flex flex-col gap-3.5">
        <span>Title (English)</span>
        <input
          required
          type="text"
          value={titleEn}
          placeholder="Title (English)"
          onChange={(e) => setTitleEn(e.target.value)}
        />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-3.5">
        <span>Description (Uzbek)</span>
        <textarea
          required
          value={description}
          placeholder="Description (Uzbek)"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {/* Description En */}
      <label className="flex flex-col gap-3.5">
        <span>Description (English)</span>
        <textarea
          required
          value={descriptionEn}
          placeholder="Description (English)"
          onChange={(e) => setDescriptionEn(e.target.value)}
        />
      </label>

      {/* Tags */}
      <label className="flex flex-col gap-3.5">
        <span>Tags</span>
        <input
          required
          type="text"
          value={tags}
          placeholder="Tags (comma separated)"
          onChange={(e) => setTags(e.target.value)}
        />
      </label>

      {/* Level */}
      <label className="flex flex-col gap-3.5">
        <span>Level</span>
        <select
          required
          defaultValue={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="easy">Easy</option>
        </select>
      </label>

      {/* Type */}
      <label className="flex flex-col gap-3.5">
        <span>Type</span>
        <input
          required
          type="text"
          value={type}
          placeholder="Type"
          onChange={(e) => setType(e.target.value)}
        />
      </label>

      {/* Project Link */}
      <label className="flex flex-col gap-3.5">
        <span>Link</span>
        <div className="flex w-full">
          {/* input */}
          <input
            required
            type="url"
            value={link}
            placeholder="Link"
            className="w-full border-r-0"
            onChange={(e) => setLink(e.target.value)}
          />

          {/* select url type */}
          <select
            required
            defaultValue="website"
            onChange={handleUpdateUrlType}
          >
            <option value="website">Website</option>
            <option value="figma">Figma</option>
            <option value="telegram">Telegram</option>
            <option value="telegram-bot">Telegram bot</option>
            <option value="other">Other</option>
          </select>
        </div>
      </label>

      {/* Github Link */}
      <label className="flex flex-col gap-3.5">
        <span>Github link</span>
        <input
          required
          type="url"
          value={githubLink}
          placeholder="Github Repo Link"
          onChange={(e) => setGithubLink(e.target.value)}
        />
      </label>

      {/* Upload Image */}
      <div className="flex flex-col gap-3.5">
        <span>Upload image</span>
        <label tabIndex={0}>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <span>Upload</span>
        </label>
      </div>

      {/* Preview Uploaded Image */}
      {imageFile && (
        <div className="flex items-center gap-5">
          <img
            width={80}
            height={80}
            alt={imageFile.name}
            src={URL.createObjectURL(imageFile)}
            className="size-16 object-cover bg-white/10 border-2 border-white sm:size-20"
          />

          <div className="space-y-1.5 overflow-hidden">
            <h3 className="font-semibold truncate sm:text-lg">
              {imageFile.name}
            </h3>
            <p className="opacity-70">
              <span>Size: </span>
              {Number((imageFile.size / 1024).toFixed()).toLocaleString()}
              <span> KB</span>
            </p>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        disabled={loader}
        type="submit"
        className="bg-sky-700 h-11 disabled:opacity-70"
      >
        {loader ? "Add project..." : "Add project"}
      </button>
    </form>
  );
};

export default AddProjectForm;
