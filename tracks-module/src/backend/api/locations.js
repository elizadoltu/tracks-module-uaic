import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: "192.168.93.63",
    database: "attractions",
    user: "root",
    password: "root"
});

connection.connect(function(err) {
    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);
});

// Endpoint for fetching locations
app.get('/', (req, res) => {
    connection.query('SELECT * FROM locations', function(error, locationResults, locationFields) {
        if (error) {
            console.error("Error fetching locations data: ", error);
            res.status(500).json({ error: "Error fetching locations data" });
            return;
        }

        const locationsData = locationResults.map(row => ({
            LOCATION_ID: row.location_id,
            NAME: row.name,
            DESCRIPTION: row.description,
            IDENTIFIER: row.identifier,
            DISTANCE: row.distance,
            CATEGORY_ID: row.category_id
        }));

        console.log("Locations data:", locationsData);

        // Fetch categories data
        connection.query('SELECT * FROM point_of_interest_categories', function(error, categoryResults, categoryFields) {
            if (error) {
                console.error("Error fetching categories data: ", error);
                res.status(500).json({ error: "Error fetching categories data" });
                return;
            }

            const categoriesData = categoryResults.map(row => ({
                CATEGORY_ID: row.category_id,
                CATEGORY_NAME: row.category_name // Assuming the column name is category_name
            }));

            console.log("Categories data:", categoriesData);

            // Send both locations and categories data in the response
            res.json({ locations: locationsData, categories: categoriesData });
        });
    });
});
// Default route handler for the root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Attractions API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
