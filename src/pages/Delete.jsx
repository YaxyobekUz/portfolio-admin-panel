import React, { useEffect, useState } from "react";

// Firebase config
import { app } from "../firbase/config";

// Firebase
import {
  doc,
  getDocs,
  deleteDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Delete = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);

  const [loader, setLoader] = useState(true);
  const [loader2, setLoader2] = useState([]);
  const [projects, setProjects] = useState(null);

  // Get and Set projects data
  const getProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setLoader(false);
    setProjects(projects);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const deleteProject = async (projectId, imageUrl) => {
    setLoader2((state) => [...state, projectId]);
    try {
      await deleteDoc(doc(db, "projects", projectId));

      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } else {
        alert("The image was not deleted Image: " + imageUrl);
      }

      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      alert("Something went wrong :(");
    } finally {
      setLoader2((state) => state.filter((id) => id !== projectId));
    }
  };

  return (
    <div className="py-12">
      <div className="container space-y-12">
        {/* title */}
        <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
          Delete project
        </h1>

        {loader ? (
          // Loader
          <p className="animate-pulse">Loading...</p>
        ) : (
          // Projects
          <ul className="">
            {projects && projects.length > 0 ? (
              projects.map((project) => {
                const isLoading = loader2.includes(project.id);
                return (
                  <li
                    key={project.id}
                    className={`${
                      isLoading ? "animate-pulse" : ""
                    } flex items-center gap-5 py-1.5 odd:bg-white/5`}
                  >
                    <img
                      width={80}
                      height={80}
                      src={project.image}
                      alt="project image"
                      className="size-16 bg-white/10 object-cover border-2 border-white sm:size-20"
                    />

                    {/* details */}
                    <div className="w-full space-y-1.5 overflow-hidden">
                      <h3 className="font-semibold line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="line-clamp-1 opacity-70">
                        Type: {project.type}
                      </p>
                    </div>

                    <button
                      disabled={isLoading}
                      onClick={() => deleteProject(project.id, project.image)}
                      className="shrink-0 text-red-500 py-5 px-5 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </li>
                );
              })
            ) : (
              // Empty data
              <div className="space-y-2.5">
                <strong className="text-2xl font-semibold">
                  Something went wrong {":("}
                </strong>
                <div className="flex items-center">
                  <span className="text-lg opacity-70">
                    Please reload page.
                  </span>
                  <button
                    onClick={() => window.location.reload()}
                    className="font-medium px-5 underline"
                  >
                    Reload
                  </button>
                </div>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Delete;
