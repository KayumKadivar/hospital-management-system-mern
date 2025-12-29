import React from 'react'

const DashboardLogin = () => {
  return (
    <>
      <div className="dashboard-login">
        <h2>Login to Dashboard</h2>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default DashboardLogin