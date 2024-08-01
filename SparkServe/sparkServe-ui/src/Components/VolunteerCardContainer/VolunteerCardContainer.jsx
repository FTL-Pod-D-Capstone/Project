import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { Link } from "react-router-dom";
import LinearGradientLoading from "./LinearGradientLoading";

const VolOppContainer = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [causeFilter, setCauseFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [ageRangeFilter, setAgeRangeFilter] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [causes, setCauses] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [opportunitiesByDate, setOpportunitiesByDate] = useState({});
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getOpportunities = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/opps`);
        const opportunitiesData = response.data;
        console.log('Fetched opportunities:', opportunitiesData);

        setOpportunities(opportunitiesData);
        setFilteredOpportunities(opportunitiesData);

        // Process opportunities by date
        const oppsByDate = opportunitiesData.reduce((acc, opp) => {
          const date = new Date(opp.dateTime).toDateString();
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date]++;
          return acc;
        }, {});
        setOpportunitiesByDate(oppsByDate);

        const uniqueOrganizations = [
          ...new Set(
            opportunitiesData
              .map((opp) => opp.organization?.name)
              .filter(Boolean)
          ),
        ];
        const uniqueCauses = [
          ...new Set(
            opportunitiesData.map((opp) => opp.relatedCause).filter(Boolean)
          ),
        ];
        const uniqueAgeRanges = [
          ...new Set(
            opportunitiesData.map((opp) => opp.ageRange).filter(Boolean)
          ),
        ];

        // Sort age ranges
        const ageRangeOrder = ["All", "12+", "16+", "18+", "21+", "All ages"];
        const sortedAgeRanges = uniqueAgeRanges
          .filter(range => ageRangeOrder.includes(range))
          .sort((a, b) => ageRangeOrder.indexOf(a) - ageRangeOrder.indexOf(b));

        setOrganizations(uniqueOrganizations);
        setCauses(uniqueCauses);
        setAgeRanges(["All", ...sortedAgeRanges]);

        setIsLoading(false);
      } catch (err) {
        console.error("Error getting opportunities:", err);
        setError("Failed to load opportunities.");
        setIsLoading(false);
      }
    };

    getOpportunities();
  }, []);

  useEffect(() => {
    const filtered = opportunities.filter(
      (opp) =>
        opp.title.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (organizationFilter === "" ||
          opp.organization?.name === organizationFilter) &&
        (causeFilter === "" || opp.relatedCause === causeFilter) &&
        (dateFilter === null ||
          new Date(opp.dateTime).toDateString() ===
            dateFilter.toDateString()) &&
        (ageRangeFilter === "" || opp.ageRange === ageRangeFilter)
    );
    setFilteredOpportunities(filtered);
  }, [
    nameFilter,
    organizationFilter,
    causeFilter,
    dateFilter,
    ageRangeFilter,
    opportunities,
  ]);

  const renderDay = (date, selectedDates, pickersDayProps) => {
    const dateString = date.toDateString();
    const numOpportunities = opportunitiesByDate[dateString] || 0;

    return (
      <Badge
        key={dateString}
        overlap="circular"
        badgeContent={numOpportunities > 0 ? numOpportunities : undefined}
        color="primary"
      >
        <PickersDay {...pickersDayProps} />
      </Badge>
    );
  };

  if (isLoading) return <LinearGradientLoading />;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Search opportunities"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: "200px",
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
        <FormControl variant="outlined" sx={{ minWidth: "150px" }}>
          <InputLabel>Organization</InputLabel>
          <Select
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            label="Organization"
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org} value={org}>
                {org}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: "150px" }}>
          <InputLabel>Cause</InputLabel>
          <Select
            value={causeFilter}
            onChange={(e) => setCauseFilter(e.target.value)}
            label="Cause"
            sx={{ backgroundColor: "white" }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {causes.map((cause) => (
              <MenuItem key={cause} value={cause}>
                {cause}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={dateFilter}
            onChange={(newValue) => setDateFilter(newValue)}
            renderDay={renderDay}
            slotProps={{
              textField: {
                sx: { backgroundColor: "white" },
              },
            }}
          />
        </LocalizationProvider>
        <FormControl variant="outlined" sx={{ minWidth: "150px" }}>
          <InputLabel>Age Range</InputLabel>
          <Select
            value={ageRangeFilter}
            onChange={(e) => setAgeRangeFilter(e.target.value)}
            label="Age Range"
            sx={{ backgroundColor: "white" }}
          >
            {ageRanges.map((range) => (
              <MenuItem key={range} value={range === "All" ? "" : range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredOpportunities.map((opportunity) => {
          console.log('Opportunity in map:', opportunity);
          return (
            <Grid item xs={12} sm={6} md={4} key={opportunity.opportunityId}>
              <Card
                component={Link}
                to={`/opportunity/${opportunity.opportunityId}`}
                sx={{
                  textDecoration: "none",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                  boxShadow: "none",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    opportunity.pictureUrl ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={opportunity.title}
                  sx={{ borderRadius: "8px" }}
                />
                <CardContent sx={{ flexGrow: 1, p: 1, pt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    noWrap
                    fontWeight="bold"
                  >
                    {opportunity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {opportunity.organization?.name}
                  </Typography>
                  {opportunity.dateTime && (
                    <Typography variant="body2" color="text.secondary">
                      {new Date(opportunity.dateTime).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {opportunity.relatedCause}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {opportunity.spotsAvailable} spots
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default VolOppContainer;
