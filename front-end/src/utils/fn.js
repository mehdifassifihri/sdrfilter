export const fetchData = async (msgIds) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log(msgIds)
    const response = await fetch("http://127.0.0.1:8000/find_by_message_id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: msgIds

      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json(); 
    console.log(data)// Parse the JSON response
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for useQuery to handle it
  }
};

export const fetchFiltersByUserId = async () => {
  const userId = localStorage.getItem("userId")
  try {
    const response = await fetch(`http://localhost:8088/filters/6`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    console.log(data)
    console.log(userId)
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for useQuery to handle it
  }
};

export const fetchMsgIds = async (sdrtype,filters) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/retrieve_messages/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "sdrtype": sdrtype,
        "filters": filters
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json(); 
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for useQuery to handle it
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch(`http://localhost:8083/api/users/all`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json(); 
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error for useQuery to handle it
  }
};





