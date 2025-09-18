📦 frontend
┣ 📂 app
┃ ┣ 📜 _layout.tsx
┃ ┣ 📜 index.tsx
┃ ┗ 📜 global.css
┣ 📂 components
┃ ┣ 📂 common
┃ ┃ ┣ 📜 Button.tsx
┃ ┃ ┣ 📜 Input.tsx
┃ ┃ ┣ 📜 Card.tsx
┃ ┃ ┗ 📜 Modal.tsx
┃ ┣ 📂 layout
┃ ┃ ┣ 📜 Header.tsx
┃ ┃ ┣ 📜 Sidebar.tsx
┃ ┃ ┗ 📜 BottomTab.tsx
┃ ┗ 📂 specific
┃ ┃ ┣ 📜 TenantCard.tsx
┃ ┃ ┣ 📜 RoomCard.tsx
┃ ┃ ┗ 📜 PlotCard.tsx
┣ 📂 constants
┃ ┣ 📜 colors.ts
┃ ┣ 📜 sizes.ts
┃ ┗ 📜 app.ts
┣ 📂 contexts
┃ ┣ 📜 AuthContext.tsx
┃ ┣ 📜 ThemeContext.tsx
┃ ┗ 📜 index.ts
┣ 📂 hooks
┃ ┣ 📜 useAuth.ts
┃ ┣ 📜 useApi.ts
┃ ┗ 📜 useTheme.ts
┣ 📂 navigation
┃ ┣ 📜 AppNavigator.tsx
┃ ┣ 📜 AuthNavigator.tsx
┃ ┣ 📜 BottomTabNavigator.tsx
┃ ┗ 📂 types
┃ ┃ ┗ 📜 index.ts
┣ 📂 screens
┃ ┣ 📂 auth
┃ ┃ ┣ 📜 LoginScreen.tsx
┃ ┃ ┗ 📜 RegisterScreen.tsx
┃ ┣ 📂 dashboard
┃ ┃ ┣ 📜 DashboardScreen.tsx
┃ ┃ ┗ 📜 Statistics.tsx
┃ ┣ 📂 plots
┃ ┃ ┣ 📜 PlotListScreen.tsx
┃ ┃ ┗ 📜 PlotDetailScreen.tsx
┃ ┣ 📂 tenants
┃ ┃ ┣ 📜 TenantListScreen.tsx
┃ ┃ ┗ 📜 TenantDetailScreen.tsx
┃ ┣ 📂 finance
┃ ┃ ┣ 📜 FinanceScreen.tsx
┃ ┃ ┗ 📜 PaymentHistory.tsx
┃ ┗ 📂 profile
┃ ┃ ┣ 📜 ProfileScreen.tsx
┃ ┃ ┗ 📜 SettingsScreen.tsx
┣ 📂 services
┃ ┣ 📂 api
┃ ┃ ┣ 📜 client.ts
┃ ┃ ┣ 📜 auth.ts
┃ ┃ ┣ 📜 plots.ts
┃ ┃ ┗ 📜 tenants.ts
┃ ┣ 📂 storage
┃ ┃ ┗ 📜 asyncStorage.ts
┃ ┗ 📂 notifications
┃ ┃ ┗ 📜 pushNotifications.ts
┣ 📂 utils
┃ ┣ 📜 helpers.ts
┃ ┣ 📜 validators.ts
┃ ┗ 📜 formatters.ts
┣ 📂 types
┃ ┣ 📜 auth.ts
┃ ┣ 📜 plots.ts
┃ ┗ 📜 tenants.ts
┣ 📂 themes
┃ ┣ 📜 light.ts
┃ ┗ 📜 dark.ts
┣ 📂 assets
┃ ┣ 📂 images
┃ ┃ ┣ 📜 logo.png
┃ ┃ ┣ 📜 avatar-placeholder.png
┃ ┃ ┗ 📜 no-image.png
┃ ┗ 📂 icons
┃ ┃ ┣ 📜 home.png
┃ ┃ ┣ 📜 plots.png
┃ ┃ ┗ 📜 tenants.png
┗ 📂 __tests__
┃ ┣ 📂 components
┃ ┃ ┗ 📜 Button.test.tsx
┃ ┣ 📂 screens
┃ ┃ ┗ 📜 LoginScreen.test.tsx
┃ ┗ 📂 services
┃ ┃ ┗ 📜 auth.test.ts