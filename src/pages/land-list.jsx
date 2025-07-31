import React, { useState } from "react";

// Bootstrap or your custom CSS should be imported globally for styling

const LandList = () => {
  const [formData, setFormData] = useState({
    map_name: "",
    status: "Draft",
    processed_on: "",
    longitude: "",
    latitude: "",
    amended_from: "",
    linked_with: "",
  });

  const [tractMapFile, setTractMapFile] = useState(null);
  const [surveyPdfFile, setSurveyPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tracts, setTracts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "tract_map_file") setTractMapFile(files[0]);
    if (name === "survey_pdf") setSurveyPdfFile(files[0]);
  };

  const uploadFile = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("is_private", 0);

    const res = await fetch("http://127.0.0.1:8000/api/method/upload_file", {
      method: "POST",
      headers: {
        Authorization: "token c46363135b5e6ef:5f5c16592c4a96d", // replace this with your token
      },
      body: data,
    });

    if (!res.ok) throw new Error("File upload failed");
    const json = await res.json();
    return json.message.file_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Create base document
      const createPayload = {
        doc: {
          doctype: "Tract Profile",
          ...formData,
        },
      };

      const res = await fetch("http://127.0.0.1:8000/api/resource/Tract Profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
        },
        body: JSON.stringify(createPayload),
      });

      if (!res.ok) throw new Error("Failed to create Tract Profile");
      const doc = await res.json();
      const docName = doc.data.name;

      // Step 2: Upload files and update the document
      const tract_map_file = tractMapFile ? await uploadFile(tractMapFile) : "";
      const survey_pdf = surveyPdfFile ? await uploadFile(surveyPdfFile) : "";

      await fetch(`http://127.0.0.1:8000/api/resource/Tract Profile/${docName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
        },
        body: JSON.stringify({
          ...formData,
          tract_map_file,
          survey_pdf,
        }),
      });

      // Step 3: Call custom method to extract tract data
      const extractRes = await fetch(
        "http://127.0.0.1:8000/api/method/landcrm.landcrm.doctype.tract_profile.tract_profile.extract_tract_data_for_doc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
          },
          body: JSON.stringify({ docname: docName }),
        }
      );

      if (!extractRes.ok) throw new Error("Failed to extract tract data");
      const tractData = await extractRes.json();

      setTracts(tractData.message); // Assuming backend returns `message: [list of tracts]`

      alert("Tract data extracted successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-4">
      <form onSubmit={handleSubmit}>
        {/* Form Section */}
        <div className="card mb-4">
          <div className="card-header flex items-center justify-between">
            <h5 className="text-lg font-semibold">Create Tract Profile</h5>
            
            <button className="btn btn-outline-primary" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Create and Extract"}
            </button>
          </div>

          
          <div className="card-body row g-3">
            <div className="col-md-4">
              <label>Map Name</label>
              <input type="text" name="map_name" className="form-control" value={formData.map_name} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label>Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="Draft">Draft</option>
                <option value="Processed">Processed</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Processed On</label>
              <input type="date" name="processed_on" className="form-control" value={formData.processed_on} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label>Longitude</label>
              <input type="text" name="longitude" className="form-control" value={formData.longitude} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label>Latitude</label>
              <input type="text" name="latitude" className="form-control" value={formData.latitude} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label>Map Image</label>
              <input type="file" name="tract_map_file" className="form-control" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="col-md-4">
              <label>Survey PDF</label>
              <input type="file" name="survey_pdf" className="form-control" onChange={handleFileChange} accept=".pdf" />
            </div>
            <div className="col-md-4">
              <label>Amended From</label>
              <input type="text" name="amended_from" className="form-control" value={formData.amended_from} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label>Linked With</label>
              <input type="text" name="linked_with" className="form-control" value={formData.linked_with} onChange={handleChange} />
            </div>
          </div>
        </div>

        
      </form>

      {/* Tracts Table Section */}
      {tracts.length > 0 && (
        <div className="card mb-5">
          <div className="card-header"><h5>Extracted Land Tracts</h5></div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover" >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Acreage</th>
                  <th>Coordinates</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Address</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>Zip</th>
                  <th>County</th>
                  <th>Price</th>
                  <th>Utilities Enabled</th>
                  <th>Electricity</th>
                  <th>Well Water</th>
                  <th>Stream</th>
                  <th>Pond</th>
                  <th>Septic</th>
                  <th>City Water</th>
                  <th>Sewer</th>
                  <th>Notes</th>
                  <th>Listed Price</th>
                  <th>Price Updated On</th>
                  <th>Original Price</th>
                  <th>Price Notes</th>
                  <th>Status</th>
                  <th>Last Status Update</th>
                  <th>Slack Sent</th>
                  
                </tr>
              </thead>
              <tbody style={{ overflowX: "auto", maxWidth: "100%" }}>
                {tracts.map((tract, idx) => (
                  <tr key={idx}>
                    <td>{tract.tract_id}</td>
                    <td>{tract.tract_name}</td>
                    <td>{tract.acres}</td>
                    <td>{tract.coordinates}</td>
                    <td>{tract.latitude}</td>
                    <td>{tract.longitude}</td>
                    <td>{tract.address}</td>
                    <td>{tract.country}</td>
                    <td>{tract.state}</td>
                    <td>{tract.zip_code}</td>
                    <td>{tract.county}</td>
                    <td>{tract.price}</td>
                    <td><input type="checkbox" checked={tract.utilities_enabled} readOnly /></td>
                    <td><input type="checkbox" checked={tract.electricity} readOnly /></td>
                    <td><input type="checkbox" checked={tract.well_water} readOnly /></td>
                    <td><input type="checkbox" checked={tract.stream} readOnly /></td>
                    <td><input type="checkbox" checked={tract.pond} readOnly /></td>
                    <td><input type="checkbox" checked={tract.septic} readOnly /></td>
                    <td><input type="checkbox" checked={tract.city_water} readOnly /></td>
                    <td><input type="checkbox" checked={tract.sewer} readOnly /></td>
                    <td>{tract.notes}</td>
                    <td>{tract.listed_price}</td>
                    <td>{tract.price_updated_on}</td>
                    <td>{tract.original_price}</td>
                    <td>{tract.price_notes}</td>
                    <td>{tract.status}</td>
                    <td>{tract.last_status_update}</td>
                    <td>{tract.slack_channel_sent ? "Yes" : "No"}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandList;

// Version 1.0 of the Land List page for importing tract maps and extracting data
// This page allows users to upload tract map files and survey PDFs, create a Tract Profile
// document, and extract tract data using a custom method in the Frappe backend.
// The code handles form inputs, file uploads, and API interactions with error handling and loading states  

// import React, { useState } from "react";

// const LandList = () => {
//   // State to hold form inputs
//   const [formData, setFormData] = useState({
//     map_name: "",
//     status: "Draft",
//     processed_on: "",
//     longitude: "",
//     latitude: "",
//     amended_from: "",
//     linked_with: "",
//   });

//   // Separate states for file inputs to upload them individually
//   const [tractMapFile, setTractMapFile] = useState(null);
//   const [surveyPdfFile, setSurveyPdfFile] = useState(null);

//   // Loading flag to disable inputs and show processing state
//   const [loading, setLoading] = useState(false);

//   // Update formData state on input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     console.log(`Field changed: ${name} = ${value}`);
//   };

//   // Handle file input changes
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       if (name === "tract_map_file") {
//         setTractMapFile(files[0]);
//         console.log("Tract Map file selected:", files[0].name);
//       } else if (name === "survey_pdf") {
//         setSurveyPdfFile(files[0]);
//         console.log("Survey PDF selected:", files[0].name);
//       }
//     }
//   };

//   // Upload a file to Frappe's /api/method/upload_file endpoint
//   const uploadFile = async (file) => {
//     console.log("Uploading file:", file.name);
//     const data = new FormData();
//     data.append("file", file);
//     data.append("is_private", 0); // public file

//     const res = await fetch("http://127.0.0.1:8000/api/method/upload_file", {
//       method: "POST",
//       headers: {
//         Authorization: "token c46363135b5e6ef:5f5c16592c4a96d", // Replace with your token
//       },
//       body: data,
//     });

//     if (!res.ok) {
//       console.error("File upload failed for:", file.name);
//       throw new Error("File upload failed");
//     }

//     const json = await res.json();
//     console.log("File uploaded successfully:", json.message.file_url);
//     return json.message.file_url;
//   };

//   // Form submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     console.log("Submit started with form data:", formData);

//     try {
//       // Step 1: Create the Tract Profile document WITHOUT files initially
//       const createPayload = {
//         doc: {
//           doctype: "Tract Profile",
//           map_name: formData.map_name,
//           status: formData.status,
//           processed_on: formData.processed_on,
//           longitude: formData.longitude,
//           latitude: formData.latitude,
//           amended_from: formData.amended_from,
//           linked_with: formData.linked_with,
//         },
//       };

//       const createRes = await fetch("http://127.0.0.1:8000/api/resource/Tract Profile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
//         },
//         body: JSON.stringify(createPayload),
//       });

//       if (!createRes.ok) {
//         const errData = await createRes.json();
//         console.error("Failed to create Tract Profile doc:", errData);
//         throw new Error(errData.message || "Failed to create Tract Profile");
//       }

//       const createData = await createRes.json();
//       console.log("Tract Profile created:", createData);

//       const docName = encodeURIComponent(createData.data.name);

//       // Step 2: Upload files if selected
//       let tract_map_file_url = "";
//       let survey_pdf_url = "";

//       if (tractMapFile) {
//         tract_map_file_url = await uploadFile(tractMapFile);
//       }
//       if (surveyPdfFile) {
//         survey_pdf_url = await uploadFile(surveyPdfFile);
//       }

//       // Step 3: PATCH the Tract Profile with all fields including uploaded file URLs
//       const patchPayload = {
//         map_name: formData.map_name,
//         status: formData.status,
//         processed_on: formData.processed_on,
//         longitude: formData.longitude,
//         latitude: formData.latitude,
//         amended_from: formData.amended_from,
//         linked_with: formData.linked_with,
//         tract_map_file: tract_map_file_url,
//         survey_pdf: survey_pdf_url,
//       };

//       const patchRes = await fetch(`http://127.0.0.1:8000/api/resource/Tract Profile/${docName}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
//         },
//         body: JSON.stringify(patchPayload),
//       });

//       if (!patchRes.ok) {
//         const errData = await patchRes.json();
//         console.error("Failed to update Tract Profile:", errData);
//         throw new Error(errData.message || "Failed to update Tract Profile");
//       }

//       console.log("Tract Profile updated with file URLs and data.");

//       // Step 4: Call your custom method to extract tract data
//       const extractRes = await fetch(
//         "http://127.0.0.1:8000/api/method/landcrm.landcrm.doctype.tract_profile.tract_profile.extract_tract_data_for_doc",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "token c46363135b5e6ef:5f5c16592c4a96d",
//           },
//           body: JSON.stringify({ docname: createData.data.name }),
//         }
//       );

//       if (!extractRes.ok) {
//         const errData = await extractRes.json();
//         console.error("Failed to extract tract data:", errData);
//         throw new Error(errData.message || "Failed to extract tract data");
//       }

//       const extractResult = await extractRes.json();
//       console.log("Tract data extracted successfully:", extractResult);

//       alert("Tract Profile created and tract data extracted successfully!");

//       // Reset form and file inputs
//       setFormData({
//         map_name: "",
//         status: "Draft",
//         processed_on: "",
//         longitude: "",
//         latitude: "",
//         amended_from: "",
//         linked_with: "",
//       });
//       setTractMapFile(null);
//       setSurveyPdfFile(null);
//     } catch (error) {
//       alert("Error: " + error.message);
//       console.error("Submit error:", error);
//     } finally {
//       setLoading(false);
//       console.log("Submit finished");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="container pt-3 pb-3">
//       <div className="card mb-4 shadow-sm">
//         <div className="card-header">
//           <h5>Tract Map Import</h5>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             {/* Map Name */}
//             <div className="col-md-4">
//               <label className="form-label">Map Name</label>
//               <input
//                 type="text"
//                 name="map_name"
//                 className="form-control"
//                 value={formData.map_name}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//                 placeholder="Enter map name"
//               />
//             </div>

//             {/* Status */}
//             <div className="col-md-4">
//               <label className="form-label">Import Status</label>
//               <select
//                 name="status"
//                 className="form-select"
//                 value={formData.status}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="Draft">Draft</option>
//                 <option value="Processed">Processed</option>
//               </select>
//             </div>

//             {/* Processed On */}
//             <div className="col-md-4">
//               <label className="form-label">Processed On</label>
//               <input
//                 type="date"
//                 name="processed_on"
//                 className="form-control"
//                 value={formData.processed_on}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </div>

//             {/* Longitude */}
//             <div className="col-md-4">
//               <label className="form-label">Longitude</label>
//               <input
//                 type="text"
//                 name="longitude"
//                 className="form-control"
//                 value={formData.longitude}
//                 onChange={handleChange}
//                 disabled={loading}
//                 placeholder="e.g. 90.4125"
//               />
//             </div>

//             {/* Latitude */}
//             <div className="col-md-4">
//               <label className="form-label">Latitude</label>
//               <input
//                 type="text"
//                 name="latitude"
//                 className="form-control"
//                 value={formData.latitude}
//                 onChange={handleChange}
//                 disabled={loading}
//                 placeholder="e.g. 23.8103"
//               />
//             </div>

//             {/* Map File Upload */}
//             <div className="col-md-4">
//               <label className="form-label">Map File</label>
//               <input
//                 type="file"
//                 name="tract_map_file"
//                 className="form-control"
//                 onChange={handleFileChange}
//                 disabled={loading}
//                 accept="image/*"
//               />
//               {tractMapFile && <small>Selected: {tractMapFile.name}</small>}
//             </div>

//             {/* Survey PDF Upload */}
//             <div className="col-md-4">
//               <label className="form-label">Survey Document</label>
//               <input
//                 type="file"
//                 name="survey_pdf"
//                 className="form-control"
//                 onChange={handleFileChange}
//                 disabled={loading}
//                 accept=".pdf"
//               />
//               {surveyPdfFile && <small>Selected: {surveyPdfFile.name}</small>}
//             </div>

//             {/* Amended From */}
//             <div className="col-md-4">
//               <label className="form-label">Amended From</label>
//               <input
//                 type="text"
//                 name="amended_from"
//                 placeholder="Linked Tract Profile"
//                 className="form-control"
//                 value={formData.amended_from}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </div>

//             {/* Linked With */}
//             <div className="col-md-4">
//               <label className="form-label">Linked With</label>
//               <input
//                 type="text"
//                 name="linked_with"
//                 placeholder="Linked Tract Profile"
//                 className="form-control"
//                 value={formData.linked_with}
//                 onChange={handleChange}
//                 disabled={loading}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="d-flex justify-content-end p-2">
//         <button type="submit" className="btn btn-primary" disabled={loading}>
//           {loading ? "Processing..." : "Extract Tract Data"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LandList;

