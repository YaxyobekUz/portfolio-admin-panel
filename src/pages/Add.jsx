import React from "react";

// Components
import AddProjectForm from "../components/AddProjectForm";

const Add = () => {
  return (
    <div className="py-12">
      <div className="container space-y-12">
        {/* title */}
        <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
          Add new project
        </h1>

        {/* form */}
        <AddProjectForm />
      </div>
    </div>
  );
};

export default Add;
