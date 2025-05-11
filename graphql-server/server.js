require('dotenv').config();
const { Pool } = require('pg');
const { ApolloServer, gql } = require('apollo-server');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

const typeDefs = gql`
  type Food {
    label: String
    cal: Int
    brand: String
  }

  type FoodLog {
    id: ID
    user_id: String
    food_id: String
    label: String
    kcal: Int
    created_at: String
  }

  type DailyTotal {
    date: String
    total: Int
  }

  type Query {
    foodLogsForDate(user_id: String!, date: String!): [FoodLog]
    searchFood(query: String!): [Food]
    caloriesPerDay(user_id: String!, days: Int!): [DailyTotal]
  }

  type Mutation {
    register(email: String!, password: String!): Boolean
    login(email: String!, password: String!): String
    addFoodLog(user_id: String!, label: String!, cal: Int!, brand: String!): Boolean
    deleteFoodLog(id: ID!, user_id: String!): Boolean
  }
`;

const resolvers = {
  Query: {
    searchFood: async (_, { query }) => {
      const appId = process.env.EDAMAM_APP_ID;
      const appKey = process.env.EDAMAM_APP_KEY;
      const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(query)}&app_id=${appId}&app_key=${appKey}`;
      
      const res = await fetch(url);
      const data = await res.json();

      return data.hints.map(item => ({
        label: item.food.label,
        cal: Math.round(item.food.nutrients.ENERC_KCAL) || 0,
        brand: item.food.brand || 'Generic',
      }));
    },

    foodLogsForDate: async (_, { user_id, date }) => {
      try {
        const res = await pool.query(
          `SELECT * FROM food_log WHERE user_id = $1 AND DATE(created_at) = $2`,
          [user_id, date]
        );
        return res.rows;
      } catch (err) {
        console.error('Error fetching logs:', err);
        return [];
      }
    },

    caloriesPerDay: async (_, { user_id, days }) => {
      try {
        const res = await pool.query(
          `
          SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date, SUM(kcal)::int AS total
          FROM food_log
          WHERE user_id = $1 AND created_at >= NOW() - ($2 * INTERVAL '1 day')
          GROUP BY DATE(created_at)
          ORDER BY DATE(created_at)
          `,
          [user_id, days]
        );
        return res.rows;
      } catch (err) {
        console.error('Error fetching daily calories:', err);
        return [];
      }
    },
  },

  Mutation: {
    register: async (_, { email, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          `INSERT INTO users (email, password) VALUES ($1, $2)`,
          [email, hashedPassword]
        );
        return true;
      } catch (err) {
        console.error('Error during registration:', err);
        return false;
      }
    },

    login: async (_, { email, password }) => {
      try {
        const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = res.rows[0];
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user.id.toString() : null;
      } catch (err) {
        console.error('Login error:', err);
        return null;
      }
    },

    addFoodLog: async (_, { user_id, label, cal, brand }) => {
      try {
        await pool.query(
          `INSERT INTO food_log (user_id, food_id, label, kcal)
           VALUES ($1, $2, $3, $4)`,
          [user_id, `${label}-${brand}`, label, cal]
        );
        return true;
      } catch (err) {
        console.error('Error saving log to database:', err);
        return false;
      }
    },

    deleteFoodLog: async (_, { id, user_id }) => {
      try {
        await pool.query(
          `DELETE FROM food_log WHERE id = $1 AND user_id = $2`,
          [id, user_id]
        );
        return true;
      } catch (err) {
        console.error('Error deleting food log:', err);
        return false;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

