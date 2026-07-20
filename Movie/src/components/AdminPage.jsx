import { useState } from "react";
import NavBar from "./NavBar";
import { clearAuthState, loadAuthState } from "../utils/authStorage";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("users");
  const [activeSection, setActiveSection] = useState("manage-users");
  const [auth, setAuth] = useState(() => loadAuthState());
  
  const handleLogout = async () => {
      if (!auth.token) {
        clearAuthState();
        setAuth(loadAuthState());
        return;
      }
  
      try {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: auth.token }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      } finally {
        clearAuthState();
        setAuth(loadAuthState());
      }
    };

    const handleBrowseMovies = () => {
        setIsFiltered(false);
        setIsSearching(false);

        fetch("http://localhost:8080/api/movies/current")
            .then(res => res.json())
            .then(data => setFeaturedMovies(data));

        fetch("http://localhost:8080/api/movies/coming-soon")
            .then(res => res.json())
            .then(data => setComingSoonMovies(data));
    };

  const menuItems = [
    {
      id: "users",
      label: "Users",
      options: [
        { id: "manage-users", label: "Manage Users" },
        { id: "add-user", label: "Add User" },
        { id: "delete-user", label: "Delete User" },
      ],
    },
    {
      id: "admins",
      label: "Admins",
      options: [
        { id: "manage-admins", label: "Manage Admins" },
        { id: "add-admin", label: "Add Admin" },
        { id: "delete-admin", label: "Delete Admin" },
      ],
    },
    {
      id: "movies",
      label: "Movies",
      options: [
        { id: "manage-movies", label: "Manage Movies" },
        { id: "add-movie", label: "Add Movie" },
        { id: "delete-movie", label: "Delete Movie" },
      ],
    },
    {
      id: "promotions",
      label: "Promotions",
      options: [
        {
          id: "manage-promotions",
          label: "Manage Promotions",
        },
        {
          id: "add-promotion",
          label: "Add Promotion",
        },
        {
          id: "delete-promotion",
          label: "Delete Promotion",
        },
      ],
    },
  ];

  const handleMenuClick = (menuId) => {
    setOpenMenu((currentMenu) =>
      currentMenu === menuId ? null : menuId
    );
  };

  const handleOptionClick = (menuId, optionId) => {
    setOpenMenu(menuId);
    setActiveSection(optionId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "manage-users":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Users
            </h1>

            <p className="mt-4 text-gray-300">
              View, activate, suspend, or remove customer accounts.
            </p>
          </div>
        );

      case "add-user":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add User
            </h1>

            <p className="mt-4 text-gray-300">
              Create a new customer account.
            </p>
          </div>
        );

      case "delete-user":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete User
            </h1>

            <p className="mt-4 text-gray-300">
              Search for and remove a customer account.
            </p>
          </div>
        );

      case "manage-admins":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Admins
            </h1>

            <p className="mt-4 text-gray-300">
              View and manage administrator accounts.
            </p>
          </div>
        );

      case "add-admin":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add Admin
            </h1>

            <p className="mt-4 text-gray-300">
              Create a new administrator account.
            </p>
          </div>
        );

      case "delete-admin":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete Admin
            </h1>

            <p className="mt-4 text-gray-300">
              Remove an administrator account.
            </p>
          </div>
        );

      case "manage-movies":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Movies
            </h1>

            <p className="mt-4 text-gray-300">
              View and edit movie information and showtimes.
            </p>
          </div>
        );

      case "add-movie":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add Movie
            </h1>

            <p className="mt-4 text-gray-300">
              Add a new movie to the cinema catalog.
            </p>
          </div>
        );

      case "delete-movie":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete Movie
            </h1>

            <p className="mt-4 text-gray-300">
              Remove a movie from the cinema catalog.
            </p>
          </div>
        );

      case "manage-promotions":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Manage Promotions
            </h1>

            <p className="mt-4 text-gray-300">
              View, edit, activate, or deactivate promotions.
            </p>
          </div>
        );

      case "add-promotion":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Add Promotion
            </h1>

            <p className="mt-4 text-gray-300">
              Create a new promotional offer or discount code.
            </p>
          </div>
        );

      case "delete-promotion":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Delete Promotion
            </h1>

            <p className="mt-4 text-gray-300">
              Remove an existing promotion.
            </p>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-white">
              Admin Dashboard
            </h1>
          </div>
        );
    }
  };

  if (!auth.userId) {
          return (
            <div className="min-h-screen bg-[#0b0b0b] text-white">
                <NavBar
                    isLoggedIn={Boolean(auth.token)}
                    onLogout={handleLogout}
                    isSignUpPage={true}
                />
  
                <div className="p-8 text-center">
                    <p>You must be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <NavBar booking={true} onBrowseMovies={handleBrowseMovies} isLoggedIn={Boolean(auth.token)} onLogout={handleLogout} isProfilePage={true} isSignUpPage={true}/>

      <div className="flex min-h-[calc(100vh-96px)]">
        <aside className="w-64 h-[calc(100vh-96px)] shrink-0 bg-black">
          <h2 className="border-b border-[#003D1A] px-6 py-6 text-2xl font-bold text-white">
            Admin Panel
          </h2>

          <nav className="w-64 flex flex-col border-0">
            {menuItems.map((menu) => {
              const isOpen = openMenu === menu.id;

              const containsSelectedOption = menu.options.some(
                (option) => option.id === activeSection
              );

              return (
                <div
                  key={menu.id}
                  className="w-64 border-b border-[#161616]"
                >
                  <button
                    type="button"
                    onClick={() => handleMenuClick(menu.id)}
                    className={`flex w-64 items-center justify-between px-6 py-4 text-left text-lg transition-colors box-border ${
                    isOpen
                        ? "bg-[#003D1A] text-[#D4AF37]"
                        : "text-white hover:bg-[#121212] hover:text-[#D4AF37]"
                    }`}
                  >
                    <span>{menu.label}</span>

                    <span className="text-sm">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="w-64 bg-[#090909]">
                      {menu.options.map((option) => {
                        const isSelected = activeSection === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                            setActiveSection(option.id);
                            setOpenMenu(menu.id);
                            }}
                            className={`block w-64 border-l-4 px-10 py-3 text-left box-border transition-colors ${
                              isSelected
                                ? "border-[#D4AF37] bg-[#123d25] text-[#D4AF37]"
                                : "border-transparent text-gray-300 hover:bg-[#121212] hover:text-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="m-8 min-h-[calc(100%-4rem)] rounded-xl border border-[#003D1A] bg-[#121212] p-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}