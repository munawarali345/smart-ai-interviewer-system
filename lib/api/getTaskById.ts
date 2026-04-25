
// =====================================================
// TASK API HELPER
// Purpose: single task fetch reusable function
// =====================================================
import API_URL from "@/config/api";

 const getTaskById = async (taskId: string) => {

  try {

    // =====================================================
    // API CALL
    // =====================================================
    const res = await fetch(`${API_URL}/api/tasks/${taskId}`);

    // =====================================================
    // ERROR CHECK
    // =====================================================
    if (!res.ok) {
      throw new Error("Failed to fetch task");
    }

    // =====================================================
    // JSON CONVERT
    // =====================================================
    const data = await res.json();

    // =====================================================
    // RETURN TASK
    // =====================================================
    return data.data;

  } catch (error) {

    console.error(" getTaskById error: ", error);
    return null;

  }
};

export default getTaskById;