const Facility = require('../models/Facility');

module.exports = async () => {
  console.log("🌱 Seeding Facilities...");

  const facilityData = [
    {
      facility_name: "Apollo Hospital",
      facility_code: "AP-HOS-001",
      facility_type: "Hospital",
      facility_description: "Leading multi-specialty hospital.",

      address_line_1: "123 Main Road",
      address_line_2: "Block A",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",

      contact_number: "9876543210",
      email_id: "contact@apollo.com",

      letterhead_logo: "/uploads/logos/apollo.png",
      header_text: "Apollo Healthcare",
      footer_text: "ISO Certified Hospital",

      pacs_ae_title: "APOLLO_AE",
      pacs_ip_address: "192.168.1.10",
      pacs_port: 104,
      ris_url: "https://ris.apollo.com",
      integration_status: "Connected",

      status: "Active"
    },

    {
      facility_name: "City Diagnostic Center",
      facility_code: "CDC-002",
      facility_type: "Diagnostic Center",

      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400001",

      contact_number: "9988776655",
      email_id: "info@cdc.com",

      pacs_ae_title: "CDC_AE",
      pacs_ip_address: "192.168.2.20",
      pacs_port: 104,
      ris_url: "https://ris.cdc.com",
      integration_status: "Pending",

      status: "Active"
    }
  ];

  await Facility.bulkCreate(facilityData);
  console.log("✅ Facility Seeding Completed");
};
