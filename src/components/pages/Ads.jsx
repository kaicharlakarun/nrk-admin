import React, { useEffect, useState } from "react";
import BASE_URL from "../../constants/constants";
import LoadingSpinner from "../../constants/Loading/LoadingSpinner";
import AdsForm from "./widgets/Ads/AdsForm";
import AdsTable from "./widgets/Ads/AdsTable";
import AdsStatsCards from "./widgets/stats/AdsStatsCards";

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    paymentMode: "",
    amount: "",
  });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // fetch all ads
  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/ads`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch ads");

      const data = await res.json();
      setAds(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${BASE_URL}/api/ads/${editId}` : `${BASE_URL}/api/ads`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save ad");
      }

      await fetchAds();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ date: "", paymentMode: "", amount: "" });
    setEditId(null);
  };

  const handleEdit = (ad) => {
    setEditId(ad._id);
    setFormData({
      date: ad.date.split("T")[0], // format YYYY-MM-DD
      paymentMode: ad.paymentMode,
      amount: ad.amount,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/ads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete ad");
      }

      setAds((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="col-span-full">
        <LoadingSpinner text="Loading Ads..." />
      </div>
    );

  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
  
    <div className="space-y-6">
        {/* Ads Stats */}
<AdsStatsCards ads={ads} />
      <AdsForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        editId={editId}
        resetForm={resetForm}
      />

      <AdsTable ads={ads} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default Ads;
