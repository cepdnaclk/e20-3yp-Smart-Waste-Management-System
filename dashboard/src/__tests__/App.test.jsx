import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, beforeEach, jest } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from '../App';

// Mock the child components
import { vi } from 'vitest';

vi.mock('../components/Sidebar', () => ({
  default: function MockSidebar({ activeMenu, setActiveMenu }) {
    return (
      <div data-testid="sidebar">
        <button onClick={() => setActiveMenu('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveMenu('bin-management')}>Bin Management</button>
        <button onClick={() => setActiveMenu('truck-management')}>Truck Management</button>
      </div>
    );
  }
}));

vi.mock('../components/Header', () => ({
  default: function MockHeader({ onToggleSidebar, onToggleNotifications, onLogout, notificationCount }) {
    return (
      <div data-testid="header">
        <button onClick={onToggleSidebar}>Toggle Sidebar</button>
        <button onClick={onToggleNotifications}>
          Notifications ({notificationCount})
        </button>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }
}));

vi.mock('../components/Dashboard', () => ({
  default: function MockDashboard({ activeTab, onAction }) {
    return (
      <div data-testid="dashboard">
        <p>Dashboard Content - Tab: {activeTab}</p>
        <button onClick={() => onAction('refresh')}>Refresh Dashboard</button>
      </div>
    );
  }
}));

vi.mock('../components/BinManagement', () => ({
  default: function MockBinManagement({ activeTab, onAction }) {
    return (
      <div data-testid="bin-management">
        <p>Bin Management Content - Tab: {activeTab}</p>
        <button onClick={() => onAction('edit', { id: 1, name: 'Test Bin' })}>
          Edit Bin
        </button>
        <button onClick={() => onAction('delete', { id: 1, name: 'Test Bin', deleteCallback: vi.fn() })}>
          Delete Bin
        </button>
      </div>
    );
  }
}));

vi.mock('../components/TruckManagement', () => ({
  default: function MockTruckManagement({ activeTab }) {
    return <div data-testid="truck-management">Truck Management Content - Tab: {activeTab}</div>;
  }
}));

vi.mock('../components/UserManagement', () => ({
  default: function MockUserManagement() {
    return <div data-testid="user-management">User Management Content</div>;
  }
}));

vi.mock('../components/RouteManagement', () => ({
  default: function MockRouteManagement() {
    return <div data-testid="route-management">Route Management Content</div>;
  }
}));

// Mock CSS import
vi.mock('../styles/styles.css', () => ({}));

describe('App Component', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for responsive behavior
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  // Test 1: Menu Navigation and Tab Management
  test('handles menu navigation and tab changes correctly', async () => {
    render(<App onLogout={mockOnLogout} />);

    // Initially should show dashboard
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Content - Tab: tab1')).toBeInTheDocument();

    // Check initial tab headers for dashboard
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();

    // Navigate to bin management
    fireEvent.click(screen.getByText('Bin Management'));
    
    await waitFor(() => {
      expect(screen.getByTestId('bin-management')).toBeInTheDocument();
      expect(screen.getByText('Bin Management Content - Tab: tab1')).toBeInTheDocument();
    });

    // Check that tab headers changed to bin management tabs
    expect(screen.getByText('All Bins')).toBeInTheDocument();
    expect(screen.getByText('Active Bins')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Bin Map')).toBeInTheDocument();

    // Test tab switching within bin management
    fireEvent.click(screen.getByText('Active Bins'));
    
    await waitFor(() => {
      expect(screen.getByText('Bin Management Content - Tab: tab2')).toBeInTheDocument();
    });

    // Verify active tab styling
    const activeTabButton = screen.getByText('Active Bins');
    expect(activeTabButton).toHaveClass('app__tab-button--active');

    // Navigate to truck management
    fireEvent.click(screen.getByText('Truck Management'));
    
    await waitFor(() => {
      expect(screen.getByTestId('truck-management')).toBeInTheDocument();
      // Should reset to tab1 when changing menus
      expect(screen.getByText('Truck Management Content - Tab: tab1')).toBeInTheDocument();
    });
  });

  // Test 2: Modal Operations (Add, Edit, Delete)
  test('handles modal operations for CRUD actions', async () => {
    render(<App onLogout={mockOnLogout} />);

    // Navigate to bin management to test CRUD operations
    fireEvent.click(screen.getByText('Bin Management'));
    
    await waitFor(() => {
      expect(screen.getByTestId('bin-management')).toBeInTheDocument();
    });

    // Test Add Modal
    const addButton = screen.getByTitle('Add Bin');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Bin')).toBeInTheDocument();
      expect(screen.getByText('Form fields for adding a bin would go here.')).toBeInTheDocument();
    });

    // Close add modal
    fireEvent.click(screen.getByText('Cancel'));
    
    await waitFor(() => {
      expect(screen.queryByText('Add New Bin')).not.toBeInTheDocument();
    });

    // Test Edit Modal
    fireEvent.click(screen.getByText('Edit Bin'));
    
    await waitFor(() => {
      expect(screen.getByText('Edit Bin')).toBeInTheDocument();
      expect(screen.getByText('Form fields for editing a bin would go here.')).toBeInTheDocument();
      expect(screen.getByText('Editing item with ID: 1')).toBeInTheDocument();
    });

    // Test Save button (currently just closes modal)
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.queryByText('Edit Bin')).not.toBeInTheDocument();
    });

    // Test Delete Modal
    fireEvent.click(screen.getByText('Delete Bin'));
    
    await waitFor(() => {
      expect(screen.getByText('Delete Bin')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this bin?')).toBeInTheDocument();
      expect(screen.getByText('Item: Test Bin')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    // Test delete confirmation
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Delete Bin')).not.toBeInTheDocument();
    });

    // Test modal overlay click to close
    fireEvent.click(screen.getByTitle('Add Bin'));
    
    await waitFor(() => {
      expect(screen.getByText('Add New Bin')).toBeInTheDocument();
    });

    // Click overlay to close (simulate clicking outside modal)
    const modalOverlay = document.querySelector('.app__modal-overlay');
    fireEvent.click(modalOverlay);
    
    await waitFor(() => {
      expect(screen.queryByText('Add New Bin')).not.toBeInTheDocument();
    });
  });

  // Test 3: Notification Management and Header Actions
  test('manages notifications and header interactions correctly', async () => {
    render(<App onLogout={mockOnLogout} />);

    // Check initial notification count in header
    expect(screen.getByText('Notifications (2)')).toBeInTheDocument();

    // Toggle notifications panel
    fireEvent.click(screen.getByText('Notifications (2)'));
    
    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Bin #245 is 90% full')).toBeInTheDocument();
      expect(screen.getByText('Truck #12 requires maintenance')).toBeInTheDocument();
      expect(screen.getByText('10 min ago')).toBeInTheDocument();
      expect(screen.getByText('1 hour ago')).toBeInTheDocument();
    });

    // Test dismissing a single notification
    const dismissButtons = screen.getAllByTitle('Dismiss notification');
    fireEvent.click(dismissButtons[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('Bin #245 is 90% full')).not.toBeInTheDocument();
      expect(screen.getByText('Truck #12 requires maintenance')).toBeInTheDocument();
      expect(screen.getByText('Notifications (1)')).toBeInTheDocument();
    });

    // Test clearing all notifications
    fireEvent.click(screen.getByText('Clear All'));
    
    await waitFor(() => {
      expect(screen.getByText('No new notifications')).toBeInTheDocument();
      expect(screen.getByText('Notifications (0)')).toBeInTheDocument();
    });

    // Verify Clear All button is disabled when no notifications
    const clearAllButton = screen.getByText('Clear All');
    expect(clearAllButton).toBeDisabled();

    // Test sidebar toggle
    const toggleSidebarButton = screen.getByText('Toggle Sidebar');
    fireEvent.click(toggleSidebarButton);
    
    // Test logout functionality
    fireEvent.click(screen.getByText('Logout'));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);

    // Test refresh action
    fireEvent.click(screen.getByText('Refresh Dashboard'));
    // This would typically trigger a console.log or data refresh

    // Test export functionality (currently shows alert)
    const originalAlert = window.alert;
    window.alert = vi.fn();
    
    // Need to navigate to a menu with export functionality
    fireEvent.click(screen.getByText('Bin Management'));
    
    await waitFor(() => {
      const refreshButton = screen.getByTitle('Refresh');
      fireEvent.click(refreshButton);
    });

    window.alert = originalAlert;
  });

  // Bonus: Test responsive behavior
  test('handles mobile responsive behavior', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    render(<App onLogout={mockOnLogout} />);

    // Trigger resize event
    fireEvent(window, new Event('resize'));

    // On mobile, sidebar should be closed initially
    // This would need to be verified based on your CSS classes and responsive behavior
  });
});