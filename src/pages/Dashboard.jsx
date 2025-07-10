import { Container, Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material'
import { Person, Dashboard as DashboardIcon, Settings, Timeline, Feed } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user } = useAuth();
  console.log(user);

  const cards = [
    {
      title: 'Profile',
      description: 'Manage your profile information',
      icon: <Person className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Feed',
      description: 'View recent posts',
      icon: <Feed className="text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: <Settings className="text-purple-600" />,
      color: 'bg-purple-50',
    },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={3} className="p-8">
        <Box className="mb-8">
          <Typography variant="h3" component="h1" gutterBottom className="text-blue-600 font-bold">
            Dashboard
          </Typography>
          <Typography variant="h6" className="text-gray-600">
            Welcome back, {user?.name || user?.email}!
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className={`${card.color} p-6`}>
                  <Box className="flex items-center mb-4">
                    {card.icon}
                    <Typography variant="h6" className="ml-2 font-semibold">
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" className="text-gray-600">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box className="mt-8">
          <Typography variant="h5" gutterBottom className="text-gray-800">
            Recent Activity
          </Typography>
          <Paper elevation={1} className="p-4 bg-gray-50">
            <Typography variant="body2" className="text-gray-600">
              No recent activity to display.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;