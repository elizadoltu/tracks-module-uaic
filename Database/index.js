const express = require('express');
const oracledb = require('oracledb');

const app = express();
const PORT = process.env.PORT || 3000;

async function fetchData() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "sys",
            password: "BUCURESTI1234",
            connectString: "localhost:1522/ORCL",
            privilege: oracledb.SYSDBA
        });
        
        const locationsResult = await connection.execute(`SELECT * FROM locations`);
        const locationsDataPromises = locationsResult.rows.map(async row => {
            let description;
            if (row[2] !== undefined && row[2] instanceof oracledb.Lob) {
                description = await row[2].getData();
            } else {
                description = row[2];
            }
            return {
                LOCATION_ID: row[0],
                NAME: row[1],
                DESCRIPTION: description,
                IDENTIFIER: row[3],
                DISTANCE: row[4],
                CATEGORY_ID: row[5]
            };
        });

        // Wait for all promises to resolve
        const locationsData = await Promise.all(locationsDataPromises);

        const categoriesResult = await connection.execute(`SELECT * FROM point_of_interest_categories`);
        const categoriesData = categoriesResult.rows.map(row => ({
            CATEGORY_ID: row[0],
            CATEGORY_NAME: row[1]
        }));

        console.log("Locations data:", locationsData);
        console.log("Categories data:", categoriesData);

        return { locations: locationsData, categories: categoriesData };
    } catch (err) {
        console.error("Error fetching data: ", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection: ", err);
            }
        }
    }
}

app.get('/', async (req, res) => {
    const data = await fetchData();
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
