<script>
  export default {
    name: 'Fragment',
    functional: true,
    render(_, context) {
      return context.children
    }
  }
</script>
