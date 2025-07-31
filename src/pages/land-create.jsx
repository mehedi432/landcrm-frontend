

import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import Pagination from '@/components/shared/Pagination'
import Dropdown from '@/components/shared/Dropdown'

const actionOptions = [
    { label: "View User" },
    { label: "Delete User" },
]
const customerData = [
    { name: 'Alexandra Della', email: 'alex.della@email.com', avatar: '/images/avatar/1.png', flag: '/images/flags/1x1/us.svg', country: 'United States', cardNumber: '****6231', date: '21 Sep, 2023' },
    { name: 'Valentine Maton', email: 'valentine.maton@email.com', avatar: '/images/avatar/2.png', flag: '/images/flags/1x1/gb.svg', country: 'United Kingdom', cardNumber: '****8563', date: '25 Sep, 2023' },
    { name: 'Kenneth Hune', email: 'kenneth.hune@email.com', avatar: '/images/avatar/3.png', flag: '/images/flags/1x1/fr.svg', country: 'France', cardNumber: '****4524', date: '16 Sep, 2023' },
    { name: 'Malanie Hanvey', email: 'malanie.hanvey@email.com', avatar: '/images/avatar/4.png', flag: '/images/flags/1x1/de.svg', country: 'Germany', cardNumber: '****3486', date: '20 Sep, 2023' },
    { name: 'Archie Cantones', email: 'archie.cantones@email.com', avatar: '/images/avatar/5.png', flag: '/images/flags/1x1/bd.svg', country: 'Bangladesh', cardNumber: '****7896', date: '20 Sep, 2023' },
];

const LandList = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    return (
        <div className="col-xxl-12 container-fluid pt-3 pb-3">
            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
            {/* Section: Tract Map Import */}
            <div className="card mb-4">
                <div className="card-header">
                <h5>Tract Map Import</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {/* Map Name */}
                        <div className="col-md-4">
                        <label className="form-label">Map Name</label>
                        <input type="text" className="form-control" name="map_name" required />
                        </div>

                        {/* Import Status */}
                        <div className="col-md-4">
                        <label className="form-label">Import Status</label>
                        <select className="form-select" name="status" required>
                            <option value="Draft">Draft</option>
                            <option value="Processed">Processed</option>
                        </select>
                        </div>

                        {/* Processed On */}
                        <div className="col-md-4">
                        <label className="form-label">Processed On</label>
                        <input type="date" className="form-control" name="processed_on" />
                        </div>

                        {/* Longitude */}
                        <div className="col-md-4">
                            <label className="form-label">Longitude</label>
                            <input type="text" className="form-control" name="longitude" />
                        </div>


                        {/* Latitude */}
                        <div className="col-md-4">
                            <label className="form-label">Latitude</label>
                            <input type="text" className="form-control" name="latitude" />
                        </div>

                        {/* Map File */}
                        <div className="col-md-4">
                            <label className="form-label">Map File</label>
                            <input type="file" className="form-control" name="tract_map_file" />
                        </div>
                        
                        {/* Survey Document */}
                        <div className="col-md-4">
                            <label className="form-label">Survey Document</label>
                            <input type="file" className="form-control" name="survey_pdf" />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Amended From</label>
                            <input type="text" className="form-control" name="amended_from" placeholder="Linked Tract Profile" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Linked With</label>
                            <input type="text" className="form-control" name="amended_from" placeholder="Linked Tract Profile" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end p-2">
                <button type="submit" className="btn btn-primary">Extract Tract Data</button>
            </div>
            </div>

            <div className={`card stretch stretch-full widget-tasks-content ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Tract ID</th>
                                    <th>Tract Name</th>
                                    <th>Acreage (Acres)</th>
                                    <th>Coordinates</th>
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
                                    <th>Slack Channel Sent</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Address</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>Zip Code</th>
                                    <th>County</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerData.map((tract, index) => (
                                    <tr key={index}>
                                        <td>{tract.avatar}</td>
                                        <td>{tract.name}</td>
                                        <td>{tract.acres}</td>
                                        <td>{tract.coordinates}</td>
                                        <td>{tract.price}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.utilities_enabled}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.electricity}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.well_water}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.stream}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.pond}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.septic}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.city_water}
                                                readOnly
                                            />
                                            </td>
                                            <td>
                                            <input
                                                type="checkbox"
                                                checked={tract.sewer}
                                                readOnly
                                            />
                                            </td>

                                        <td>{tract.notes}</td>
                                        <td>{tract.listed_price}</td>
                                        <td>{tract.price_updated_on}</td>
                                        <td>{tract.original_price}</td>
                                        <td>{tract.price_notes}</td>
                                        <td>{tract.status}</td>
                                        <td>{tract.last_status_update}</td>
                                        <td>{tract.slack_channel_sent ? "Yes" : "No"}</td>
                                        <td>{tract.latitude}</td>
                                        <td>{tract.longitude}</td>
                                        <td>{tract.address}</td>
                                        <td>{tract.country}</td>
                                        <td>{tract.state}</td>
                                        <td>{tract.zip_code}</td>
                                        <td>{tract.county}</td>
                                        <td className="text-end">
                                            <Dropdown dropdownItems={actionOptions} triggerClass="avatar-md ms-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandList
