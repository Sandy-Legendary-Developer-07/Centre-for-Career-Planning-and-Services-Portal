import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import useGetAlumni from "../../api/alumni/useGetAlumni";
import useGetAllAlumni from "../../api/alumni/useGetAllAlumni";
import { useAuthContext } from '../../context/AuthContext';
import useAlumniAdmin from "../../api/alumni/useAlumniAdmin";
import toast from "react-hot-toast";

const Alumni = () => {
  const { authUser } = useAuthContext();
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("company");
  const [alumniList, setAlumniList] = useState([]);

  const { loading: loadingAll, alumni } = useGetAllAlumni();
  const { loading: loadingSearch, getAlumni } = useGetAlumni();
  const { deleteAlumni } = useAlumniAdmin();

  useEffect(() => {
    setAlumniList(alumni);
  }, [alumni]);

  const handleSearch = async () => {
    const data = await getAlumni(searchType, search);
    setAlumniList(data.length > 0 ? data : []);
  };

  const handleReset = () => {
    setSearch("");
    setSearchType("company");
    setAlumniList(alumni);
  };

  const handleDeleteAlumni = (id) => async () => {
    const token = localStorage.getItem("ccps-token");
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this alumni?")) {
      try {
        await deleteAlumni(id, token);
        setAlumniList((prev) => prev.filter((alum) => alum._id !== id));
      } catch (error) {
        toast.error("Failed to delete alumni");
      }
    }
  };

  const labelMap = {
    company: "Company Name",
    jobRole: "Job Role",
    jobId: "Job ID",
    batch: "Batch (e.g., 2022 or 2022-2025)",
    name: "Name",
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <section className="flex-1 overflow-y-auto pt-16 bg-gray-100 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mt-6 md:mt-0 font-bold text-center text-[#13665b] mb-4">
            Welcome to the Alumni Portal 🎓
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Search for alumni by company, job role, job ID, batch or name
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-8">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md"
            >
              <option value="company">Company</option>
              <option value="jobRole">Job Role</option>
              <option value="jobId">Job ID</option>
              <option value="batch">Batch</option>
              <option value="name">Name</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Enter ${labelMap[searchType]}`}
              className="px-4 py-2 border border-gray-300 rounded-md w-72"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-[#13665b] "
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-[#13665b] "
            >
              Reset Search
            </button>
          </div>

          {(loadingAll || loadingSearch) ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : alumniList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alumniList.map((alum) => (
                <div
                  key={alum._id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-[#13665b] ">{alum.name}</h3>
                  <p>Email: {alum.Email || "N/A"}</p>
                  <p>Mobile: {alum.MobileNumber || "N/A"}</p>
                  <p>Company: {alum.company || "N/A"}</p>
                  <p>Batch: {alum.batch || "N/A"}</p>
                  <p>Institute ID: {alum.InstituteId || "N/A"}</p>
                  {alum.linkedin && (
                    <a
                      href={alum.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600  hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {authUser?.role == "admin" && (
                    <p>
                      <button 
                        type="button"
                        onClick={handleDeleteAlumni(alum._id)}
                        className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none transition w-full md:w-1/2"
                      >
                        Delete Alumni
                      </button>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No alumni found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Alumni;