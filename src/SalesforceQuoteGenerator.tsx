import React, { useState } from 'react';

const SalesforceQuoteGenerator = () => {
  // Updated license data based on actual employee analysis
  const initialLicenseData = [
    { category: 'User Licenses', type: 'Salesforce', current: 366, usage: 324, recommended: 70, price: 1800, cost: 126000, notes: 'For 63 leadership roles (with buffer)' },
    { category: 'User Licenses', type: 'Lightning Platform', current: 0, usage: 0, recommended: 92, price: 300, cost: 27600, notes: 'For 83 office staff and occasional users (with buffer)' },
    { category: 'User Licenses', type: 'Salesforce Platform', current: 0, usage: 0, recommended: 65, price: 900, cost: 58500, notes: 'For 59 mid-tier users who need more robust access (with buffer)' },
    { category: 'User Licenses', type: 'Chatter Free', current: 5000, usage: 4, recommended: 50, price: 0, cost: 0, notes: 'For occasional collaboration users' },
    { category: 'User Licenses', type: 'Partner Community', current: 138, usage: 13, recommended: 20, price: 600, cost: 12000, notes: 'For dealers and installation partners' },
    { category: 'User Licenses', type: 'Customer Community', current: 10, usage: 0, recommended: 15, price: 450, cost: 6750, notes: 'For customer portal access' },
    { category: 'Field Service', type: 'Field Service Mobile', current: 366, usage: 149, recommended: 126, price: 300, cost: 37800, notes: 'For 114 field technicians, installers & electricians (with buffer)' },
    { category: 'Field Service', type: 'Field Service Dispatcher', current: 256, usage: 206, recommended: 15, price: 300, cost: 4500, notes: 'For dispatchers and service coordinators' },
    { category: 'Field Service', type: 'Field Service+ Enterprise', current: 768, usage: 'N/A', recommended: 126, price: 124, cost: 15624, notes: 'Should match Field Service Mobile count' },
    
    { category: 'Cloud Services', type: 'Service Cloud User', current: 256, usage: 35, recommended: 15, price: 1500, cost: 22500, notes: 'For customer experience team and support staff' },
    { category: 'Cloud Services', type: 'Einstein Search', current: 256, usage: 230, recommended: 227, price: 300, cost: 68100, notes: 'For all Full and Platform license users (70+65+92)' },
    { category: 'Cloud Services', type: 'Analytics Cloud Integration', current: 2, usage: 2, recommended: 3, price: 1500, cost: 4500, notes: 'For business intelligence capabilities' },
    { category: 'Digital Engagement', type: 'Digital Engagement Enterprise', current: 423, usage: 'N/A', recommended: 15, price: 37.5, cost: 562.5, notes: 'For customer support team (6 CustEx + buffer)' },
    { category: 'Digital Engagement', type: 'Service Cloud Voice Enterprise', current: 438, usage: 'N/A', recommended: 15, price: 37.5, cost: 562.5, notes: 'For customer support team (6 CustEx + buffer)' },
    
    { category: 'Marketing', type: 'Marketing User', current: 504, usage: 6, recommended: 5, price: 1200, cost: 6000, notes: 'For marketing team members' },
    { category: 'Marketing', type: 'Marketing Cloud Engagement', current: 1, usage: 'N/A', recommended: 1, price: 15000, cost: 15000, notes: 'For marketing automation capabilities' },
    
    { category: 'Storage', type: 'Data Storage (500MB)', current: 3, usage: 'N/A', recommended: 215, price: 80, cost: 17200, notes: 'To address 717% overage warning' },
    { category: 'Storage', type: 'File Storage (1TB)', current: 3, usage: 'N/A', recommended: 4, price: 210, cost: 840, notes: 'For document and file storage needs' }
  ];

  // State for license data
  const [licenseData, setLicenseData] = useState(initialLicenseData);
  
  // Function to handle changes to the recommended quantity
  const handleRecommendedChange = (index, value) => {
    const newData = [...licenseData];
    const newValue = parseInt(value) || 0;
    newData[index].recommended = newValue;
    newData[index].cost = newValue * newData[index].price;
    setLicenseData(newData);
  };
  
  // Function to handle changes to the unit price
  const handlePriceChange = (index, value) => {
    const newData = [...licenseData];
    const newValue = parseFloat(value) || 0;
    newData[index].price = newValue;
    newData[index].cost = newData[index].recommended * newValue;
    setLicenseData(newData);
  };
  
  // Calculate total cost
  const totalCost = licenseData.reduce((sum, item) => sum + item.cost, 0);
  
  // Group data by category for display
  const categories = [...new Set(licenseData.map(item => item.category))];
  
  // Function to generate and download a more detailed CSV report
  const generateDetailedCSV = () => {
    // Create rows with headers
    const headers = [
      'Category', 
      'License Type', 
      'Current Quantity', 
      'Current Usage', 
      'Recommended Quantity', 
      'Unit Price ($)', 
      'Annual Cost ($)',
      'Notes',
      'Recommended Users'
    ];
    
    // Create a more detailed mapping of recommended roles based on the employee analysis
    const userRecommendations = {
      'Salesforce': 'Executives (2), Operations Managers (6), Project VPs (3), Engineering Managers (3), Sales/Finance Managers (11), Sales Operations (5), Inside Sales Managers (6), Business Analysts (4), Customer Experience Managers (2), Regional Managers (6), HR Director (1), Recruiting Lead (1), Outside Sales Managers (8)',
      'Lightning Platform': 'Outside Sales Consultants (66), Warehouse Staff (3), Engineering Support (2), Interconnections (1), License Staff (1)',
      'Salesforce Platform': 'Inside Sales Specialists (36), Customer Experience Reps (4), Recruiting Specialists (2), Site Surveyors (16), Regional Ops Staff (1)',
      'Field Service Mobile': 'Electricians (36), Installers (35), Service Technicians (14), Foremen (10), Roof Leads (10), Lead Installers (5), Field Trainers (2)',
      'Field Service Dispatcher': 'Service Coordinators, Dispatchers',
      'Service Cloud User': 'Customer Experience Team (6), Support Staff (3), Service Managers (2)',
      'Einstein Search': 'All users with Full Salesforce or Platform Licenses',
      'Marketing User': 'Marketing Team Members'
    };
    
    // Add detailed user recommendations to each row
    const rows = licenseData.map(item => [
      item.category,
      item.type,
      item.current,
      item.usage === 'N/A' ? 'N/A' : item.usage,
      item.recommended,
      item.price,
      item.cost,
      item.notes,
      userRecommendations[item.type] || ''
    ]);
    
    // Add total row
    rows.push(['', '', '', '', '', 'TOTAL', totalCost, '', '']);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        // Wrap cells that contain commas in quotes
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Venture_Home_Solar_Salesforce_Quote_Detailed.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Venture Home Solar - Salesforce License Quote</h1>
      <p className="mb-6">
        This is an interactive quote for your Salesforce license optimization. You can edit the recommended quantities and unit prices below to see how changes affect the total cost.
      </p>
      
      <div className="overflow-x-auto mb-6">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">{category}</h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border-b text-left">License Type</th>
                  <th className="py-2 px-3 border-b text-right">Current Qty</th>
                  <th className="py-2 px-3 border-b text-right">Current Usage</th>
                  <th className="py-2 px-3 border-b text-right">Recommended Qty</th>
                  <th className="py-2 px-3 border-b text-right">Unit Price ($)</th>
                  <th className="py-2 px-3 border-b text-right">Annual Cost ($)</th>
                  <th className="py-2 px-3 border-b text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {licenseData
                  .filter((item) => item.category === category)
                  .map((item, index) => {
                    const globalIndex = licenseData.findIndex(x => x === item);
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-3 border-b font-medium">{item.type}</td>
                        <td className="py-2 px-3 border-b text-right">{item.current.toLocaleString()}</td>
                        <td className="py-2 px-3 border-b text-right">{item.usage === 'N/A' ? 'N/A' : item.usage.toLocaleString()}</td>
                        <td className="py-2 px-3 border-b text-right">
                          <input
                            type="number"
                            className="w-20 text-right border rounded py-1 px-2"
                            value={item.recommended}
                            onChange={(e) => handleRecommendedChange(globalIndex, e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-3 border-b text-right">
                          <input
                            type="number"
                            step="0.01"
                            className="w-20 text-right border rounded py-1 px-2"
                            value={item.price}
                            onChange={(e) => handlePriceChange(globalIndex, e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-3 border-b text-right">{item.cost.toLocaleString()}</td>
                        <td className="py-2 px-3 border-b text-left text-sm">{item.notes}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
        
        <div className="bg-blue-50 p-4 rounded-md mt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total Annual Cost:</span>
            <span className="text-xl font-bold">${totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={generateDetailedCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Download Detailed CSV Quote
        </button>
        <button
          onClick={() => {
            // Reset to initial values
            setLicenseData(initialLicenseData);
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Reset Values
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-600 text-center">
        Download includes detailed role recommendations for each license type.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-bold mb-3">License Allocation Strategy:</h3>
          <p className="mb-3">This optimization plan strategically allocates licenses based on employee roles:</p>
          <ul className="list-disc ml-5 space-y-2">
            <li><span className="font-semibold">Full Salesforce Licenses (140):</span> For executives, directors, sales managers, business analysts, and operations leaders who need complete platform access</li>
            <li><span className="font-semibold">Salesforce Platform Licenses (120):</span> For project managers, service coordinators, and team leaders who need robust but not complete access</li>
            <li><span className="font-semibold">Lightning Platform Licenses (110):</span> For administrative staff and users who need limited access to specific apps and records</li>
            <li><span className="font-semibold">Field Service Mobile (155):</span> Specifically for field technicians and installation specialists</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-bold mb-3">Implementation Guidance:</h3>
          <p className="mb-3">Key considerations for implementing this license structure:</p>
          <ul className="list-disc ml-5 space-y-2">
            <li><span className="font-semibold">Permission Sets:</span> Create role-specific permission sets to ensure appropriate access with cost-effective license types</li>
            <li><span className="font-semibold">Phased Rollout:</span> Implement changes gradually by department to minimize disruption</li>
            <li><span className="font-semibold">User Training:</span> Provide training for users transitioning to different license types</li>
            <li><span className="font-semibold">Storage Solution:</span> Address the 717% data storage overage immediately to avoid performance issues</li>
            <li><span className="font-semibold">Contract Negotiation:</span> Use this optimized quote as a baseline for negotiating your new contract</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h3 className="font-bold mb-2 text-center">Cost Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded shadow">
            <div className="text-lg font-bold">Current Contract</div>
            <div className="text-2xl font-bold text-red-600 mt-2">$1,192,000</div>
            <div className="text-sm text-gray-600">Annual Cost (Estimated)</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-lg font-bold">Optimized Quote</div>
            <div className="text-2xl font-bold text-green-600 mt-2">${totalCost.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Annual Cost</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-lg font-bold">Potential Savings</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">${(1192000 - totalCost).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Annual Savings</div>
          </div>
        </div>
        <p className="text-center mt-3 text-sm">Note: Current contract cost is estimated based on standard pricing of current license quantities.</p>
      </div>
    </div>
  );
};

export default SalesforceQuoteGenerator;
