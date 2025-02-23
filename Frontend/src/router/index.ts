import HomeView from '@/views/HomeView.vue'
import ItemsView from '@/views/user/ItemsView.vue'
import LoginView from '@/views/login/LoginView.vue'
import RecipesView from '@/views/user/RecipesView.vue'
import RegisterAdminView from '@/views/admin/RegisterAdminView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/login/RegisterView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import RecipeDetails from '@/views/user/RecipeDetails.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AdminItemsView from '@/views/admin/AdminItemsView.vue'
import AdminRecipesView from '@/views/admin/AdminRecipesView.vue'
import AdminTypesView from '@/views/admin/AdminTypesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/items',
      name: 'items',
      component: ItemsView,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: RecipeDetails,
      props: route => ({ query: route.query.id })
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/register-admin',
      name: 'register-admin',
      component: RegisterAdminView,
    },
    {
      path: '/add-type',
      name: 'add-type',
      component: AdminTypesView,
    },
    {
      path: '/edit-items',
      name: 'edit-items',
      component: AdminItemsView,
    },
    {
      path: '/edit-recipes',
      name: 'edit-recipes',
      component: AdminRecipesView,
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ],
})

export default router
