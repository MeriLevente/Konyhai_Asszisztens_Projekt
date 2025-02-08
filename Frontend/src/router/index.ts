import HomeView from '@/views/HomeView.vue'
import ItemsView from '@/views/user/ItemsView.vue'
import LoginView from '@/views/login/LoginView.vue'
import RecipesView from '@/views/user/RecipesView.vue'
import RegisterAdminView from '@/views/admin/RegisterAdminView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/login/RegisterView.vue'
import AdminView from '@/views/admin/AdminView.vue'
import RecipeDetails from '@/views/user/RecipeDetails.vue'
import EditItemsView from '@/views/admin/EditItemsView.vue'
import EditRecipesView from '@/views/admin/EditRecipesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import AddTypeView from '@/views/admin/AddTypeView.vue'

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
      component: AddTypeView,
    },
    {
      path: '/edit-items',
      name: 'edit-items',
      component: EditItemsView,
    },
    {
      path: '/edit-recipes',
      name: 'edit-recipes',
      component: EditRecipesView,
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  ],
})

export default router
