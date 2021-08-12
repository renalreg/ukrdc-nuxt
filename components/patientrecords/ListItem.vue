<template>
  <li>
    <div class="flex items-center py-4">
      <div class="min-w-0 flex-1 flex items-center">
        <div
          v-tooltip="'Show Details'"
          aria-label="Show details"
          class="flex flex-none items-center justify-center w-16 self-stretch cursor-pointer"
          @click="showDetail = !showDetail"
        >
          <IconChevronDown v-show="showDetail" />
          <IconChevronRight v-show="!showDetail" />
        </div>
        <div class="min-w-0 grid grid-cols-4 items-center md:gap-4 w-full pr-4">
          <!-- Name, DoB, gender -->
          <div>
            <TextL1c class="capitalize truncate">
              {{ item.sendingfacility }}
            </TextL1c>
            <TextP class="mt-2"> via {{ item.sendingextract }} </TextP>
          </div>
          <!-- National ID -->
          <div>
            <TextL1>Local ID</TextL1>
            <TextP class="mt-2">
              {{ item.localpatientid }}
            </TextP>
          </div>
          <!-- UKRDC ID -->
          <div>
            <TextL1>UKRDC ID</TextL1>
            <TextP class="mt-2">
              {{ item.ukrdcid }}
            </TextP>
          </div>
          <!-- Record links -->
          <div v-click-away="closeMenu" class="justify-self-end flex items-center">
            <GenericButtonMini :to="`/patientrecords/${item.pid}`" class="h-8">View Record</GenericButtonMini>
            <GenericButtonMini
              label="Manage record"
              tooltip="Manage Record"
              class="h-8 ml-1"
              @click="showMenu = !showMenu"
            >
              <IconChevronDown />
            </GenericButtonMini>
          </div>
          <GenericMenu class="mt-8" :show="showMenu">
            <GenericMenuItem @click.native="copyPID"> Copy PID </GenericMenuItem>
            <GenericMenuItem :disabled="true"> Delete Record </GenericMenuItem>
          </GenericMenu>
        </div>
      </div>
    </div>
    <!-- Collapsible details -->
    <div v-show="showDetail" class="pl-16 pr-4 mb-4">
      <PatientrecordsDetailCards :record="item" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { formatDate } from '@/utilities/dateUtils'
import { PatientRecord } from '@/interfaces/patientrecord'

export default defineComponent({
  props: {
    item: {
      type: Object as () => PatientRecord,
      required: true,
    },
  },
  setup(props) {
    const { $toast } = useContext()

    const showDetail = ref(false)
    const showMenu = ref(false)

    function closeMenu() {
      showMenu.value = false
    }

    function copyPID() {
      navigator.clipboard.writeText(props.item.pid).then(() => {
        closeMenu()
        $toast.show({
          type: 'success',
          title: 'Success',
          message: 'PID copied to clipboard',
          timeout: 5,
          classTimeout: 'bg-green-600',
        })
      })
    }

    return { showDetail, showMenu, closeMenu, copyPID, formatDate }
  },
})
</script>
